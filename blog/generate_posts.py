import json
import os

from generate_feed import write_feed

def load_metadata():
    with open('blog/blog-posts-metadata.json', 'r') as f:
        return json.load(f)

def load_template():
    with open('blog/blog-post-template.html', 'r') as f:
        return f.read()

def load_post_content(post_id):
    with open(f'blog/post-content/{post_id}.html', 'r') as f:
        return f.read()

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
        # Recent and Related sidebars are rendered client-side by blog-post.js
        # from blog-posts-metadata.json, so they are not baked in here. That way
        # publishing a new post only writes its own page instead of every page.

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


# RUN COMMAND to Generate Posts from MetaData
# python3 blog/generate_posts.py 