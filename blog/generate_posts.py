import html
import json
import os

from generate_feed import write_feed, parse_date
from generate_index import write_index

SITE = "https://dlightning.org"
RELATED_LIMIT = 6

def load_metadata():
    with open('blog/blog-posts-metadata.json', 'r') as f:
        return json.load(f)

def load_template():
    with open('blog/blog-post-template.html', 'r') as f:
        return f.read()

def load_post_content(post_id):
    with open(f'blog/post-content/{post_id}.html', 'r') as f:
        return f.read()


def attr(value):
    """Escape a value for use inside a double-quoted HTML attribute."""
    return html.escape(str(value), quote=True)


def pick_related(posts, current):
    """Posts to show under `current`, newest-first within each rule.

    This is the matching blog-post.js used to do in the browser: same category
    first, then fall back to whoever shares the most tags so the section never
    renders empty. Running it here instead means the links are in the served
    HTML, where a crawler can follow them.
    """
    candidates = [p for p in posts if p['id'] != current['id']]

    related = [p for p in candidates if p['category'] == current['category']][:RELATED_LIMIT]

    if len(related) < RELATED_LIMIT:
        current_tags = set(current.get('tags', []))
        chosen = {p['id'] for p in related}
        by_tags = [
            p for p in candidates
            if p['id'] not in chosen and len(set(p.get('tags', [])) & current_tags) > 0
        ]
        # Stable sort keeps metadata (newest-first) order among equal overlaps,
        # matching what Array.prototype.sort did.
        by_tags.sort(key=lambda p: len(set(p.get('tags', [])) & current_tags), reverse=True)
        related.extend(by_tags[:RELATED_LIMIT - len(related)])

    return related


def render_related(related):
    if not related:
        return ''
    # Sibling files, so the href needs no directory part.
    return '\n                        '.join(f'''<div class="col-md-6 col-lg-4 mb-4">
                            <div class="related-post">
                                <div>
                                    <a href="{attr(p['id'])}.html">
                                        <img src="../blog/{attr(p['image'])}" alt="{attr(p['title'])}" loading="lazy">
                                    </a>
                                </div>
                                <div>
                                    <a href="{attr(p['id'])}.html">
                                        <h3>{html.escape(p['title'])}</h3>
                                        <small>{html.escape(p['date'])}</small>
                                    </a>
                                </div>
                            </div>
                        </div>''' for p in related)


def render_jsonld(post, url):
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post['title'],
        "description": post['excerpt'],
        "image": f"{SITE}/blog/{post['image']}",
        "datePublished": parse_date(post['date']).date().isoformat(),
        # No separate modified date is tracked, and pointing it at the file's
        # mtime would churn the page every time it is regenerated.
        "dateModified": parse_date(post['date']).date().isoformat(),
        "author": {"@type": "Organization", "name": post['author'], "url": f"{SITE}/"},
        "publisher": {
            "@type": "Organization",
            "name": "Dlightning",
            "logo": {
                "@type": "ImageObject",
                "url": f"{SITE}/img/logo-spelled-out-white.png",
            },
        },
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "keywords": ", ".join(post.get('tags', [])),
    }
    # Escape "<" so a stray "</script>" in any field can't close the block early.
    payload = json.dumps(data, indent=2, ensure_ascii=False).replace('<', '\\u003c')
    body = '\n'.join('    ' + line for line in payload.splitlines())
    return f'<script type="application/ld+json">\n{body}\n    </script>'


def generate_posts(metadata, template):
    os.makedirs('blog-posts', exist_ok=True)
    posts = metadata['posts']
    changed, unchanged = [], []
    for post in posts:
        url = f"https://dlightning.org/blog-posts/{post['id']}.html"
        post_html = template
        # Replace placeholders
        post_html = post_html.replace('{TITLE}', post['title'])
        post_html = post_html.replace('{EXCERPT}', post['excerpt'])
        post_html = post_html.replace('{IMAGE}', post['image'])
        post_html = post_html.replace('{URL}', url)
        post_html = post_html.replace('{DATE}', post['date'])
        post_html = post_html.replace('{AUTHOR}', post['author'])
        post_html = post_html.replace('{AUTHOR_IMAGE}', post['authorImage'])
        post_html = post_html.replace('{TAGS}', ' '.join([f'<span class="tag"><i class="fas fa-tag me-1"></i>&nbsp;{tag}</span>' for tag in post['tags']]))

        img_credit = post.get('img-credit', '')
        credit_link = post.get('credit-link', '#')
        post_html = post_html.replace('{IMG-CREDIT}', img_credit)
        post_html = post_html.replace('{CREDIT-LINK}', credit_link)

        # Related posts are baked in so the post pages link to each other in the
        # served HTML — without them every post was an orphan that Google would
        # discover from the sitemap and never crawl. This block carries that
        # graph on its own. The Recent Posts sidebar stays client-side (see
        # blog-post.js): it is the newest three, so baking it would rewrite every
        # page on every publish.
        post_html = post_html.replace('{RELATED_POSTS}', render_related(pick_related(posts, post)))
        post_html = post_html.replace('{JSONLD}', render_jsonld(post, url))

        # Content goes in last so a placeholder appearing in the prose is left
        # alone rather than substituted.
        post_html = post_html.replace('{CONTENT}', load_post_content(post['id']))

        # Write only when the rendered HTML actually changed, so unchanged
        # posts are left untouched (clean git diffs, stable mtimes).
        out_path = f"blog-posts/{post['id']}.html"
        existing = None
        if os.path.exists(out_path):
            with open(out_path, 'r') as f:
                existing = f.read()
        if existing == post_html:
            unchanged.append(post['id'])
        else:
            with open(out_path, 'w') as f:
                f.write(post_html)
            changed.append(post['id'])
    return changed, unchanged

if __name__ == "__main__":
    metadata = load_metadata()
    template = load_template()
    changed, unchanged = generate_posts(metadata, template)
    print(f"Done. {len(changed)} updated, {len(unchanged)} unchanged.")
    for pid in changed:
        print(f"  updated: {pid}")

    # Rebuild the RSS feed from the same metadata so it never goes stale.
    count = write_feed(metadata)
    print(f"Wrote blog/feed.xml with {count} items.")

    # Bake the feed's cards into blog/index.html so the post links ship in the
    # HTML instead of being built by blog-list.js after load.
    count, index_changed = write_index(metadata)
    print(f"{'Wrote' if index_changed else 'Unchanged'} blog/index.html with {count} post cards.")


# RUN COMMAND to Generate Posts from MetaData
# python3 blog/generate_posts.py
