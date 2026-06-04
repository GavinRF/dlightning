import json
import os
from datetime import datetime

_warned_dates = set()

def parse_date(date_str):
    """Parse a post date like 'June 4, 2026' or 'Feb 22, 2026' into a datetime.

    Metadata uses full ('June'), abbreviated ('Feb'), and the nonstandard
    'Sept' month spellings, and days may or may not be zero-padded.
    Unrecognized values sort last and warn once each, so a typo never silently
    reorders the sidebars."""
    normalized = date_str.replace("Sept ", "Sep ")  # %b expects 'Sep'
    for fmt in ("%B %d, %Y", "%b %d, %Y"):
        try:
            return datetime.strptime(normalized, fmt)
        except ValueError:
            continue
    if date_str not in _warned_dates:
        _warned_dates.add(date_str)
        print(f"  WARNING: could not parse date '{date_str}'; it will sort last")
    return datetime.min

def load_metadata():
    with open('blog/blog-posts-metadata.json', 'r') as f:
        return json.load(f)

def load_template():
    with open('blog/blog-post-template.html', 'r') as f:
        return f.read()

def load_post_content(post_id):
    with open(f'blog/post-content/{post_id}.html', 'r') as f:
        return f.read()

def generate_recent_posts(current_post, all_posts):
    recent = sorted([p for p in all_posts if p['id'] != current_post['id']], key=lambda x: parse_date(x['date']), reverse=True)[:3]
    html = ""
    for post in recent:
        html += f"""
        <div class="recent-post">
            <div>
                <a href="{post['id']}.html">
                    <img src="../blog/{post['image']}" alt="{post['title']}">
                </a>
            </div>
            <div>
                <a href="{post['id']}.html">
                    <h3>{post['title']}</h3>
                    <small>{post['date']}</small>
                </a>
            </div>
        </div>
        """
    return html

def generate_related_posts(current_post, all_posts):
    related = [p for p in all_posts if p['category'] == current_post['category'] and p['id'] != current_post['id']]
    related = sorted(related, key=lambda x: parse_date(x['date']), reverse=True)[:4]
    html = ""
    for post in related:
        html += f"""
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="related-post">
                <div>
                    <a href="{post['id']}.html">
                        <img src="../blog/{post['image']}" alt="{post['title']}">
                    </a>
                </div>
                <div>
                    <a href="{post['id']}.html">
                        <h3>{post['title']}</h3>
                        <small>{post['date']}</small>
                    </a>
                </div>
            </div>
        </div>
        """
    return html

def generate_posts(metadata, template):
    os.makedirs('blog-posts', exist_ok=True)
    changed, unchanged = [], []
    for post in metadata['posts']:
        post_content = load_post_content(post['id'])
        post_html = template
        # Replace placeholders
        post_html = post_html.replace('{TITLE}', post['title'])
        post_html = post_html.replace('{EXCERPT}', post['excerpt'])
        post_html = post_html.replace('{IMAGE}', post['image'])
        post_html = post_html.replace('{URL}', f"https://dlightning.org/blog-posts/{post['id']}.html")
        post_html = post_html.replace('{DATE}', post['date'])
        post_html = post_html.replace('{AUTHOR}', post['author'])
        post_html = post_html.replace('{AUTHOR_IMAGE}', post['authorImage'])
        post_html = post_html.replace('{CONTENT}', post_content)
        post_html = post_html.replace('{TAGS}', ' '.join([f'<span class="tag"><i class="fas fa-tag me-1"></i>&nbsp;{tag}</span>' for tag in post['tags']]))

        img_credit = post.get('img-credit', '')
        credit_link = post.get('credit-link', '#')
        post_html = post_html.replace('{IMG-CREDIT}', img_credit)
        post_html = post_html.replace('{CREDIT-LINK}', credit_link)
        
        recent_posts = generate_recent_posts(post, metadata['posts'])
        post_html = post_html.replace('{RECENT_POSTS}', recent_posts)
        related_posts = generate_related_posts(post, metadata['posts'])
        post_html = post_html.replace('{MORE_RELATED_POSTS}', related_posts)
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


# RUN COMMAND to Generate Posts from MetaData
# python3 blog/generate_posts.py 