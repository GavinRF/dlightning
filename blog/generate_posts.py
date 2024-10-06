import json
import os
from datetime import datetime

# RUN COMMAND to Generate Posts from MetaData
# python3 blog/generate_posts.py 

def load_metadata():
    with open('blog/blog-posts-metadata.json', 'r') as f:
        return json.load(f)

def load_template():
    with open('blog/blog-post-template.html', 'r') as f:
        return f.read()

def load_post_content(post_id):
    with open(f'blog/post-content/{post_id}.html', 'r') as f:
        return f.read()

def generate_related_posts(current_post, all_posts):
    related = [p for p in all_posts if p['category'] == current_post['category'] and p['id'] != current_post['id']]
    related = sorted(related, key=lambda x: x['date'], reverse=True)[:3]
    
    html = ""
    for post in related:
        html += f"""
        <div class="related-post">
            
                <div>
                    <a href="{post['id']}.html">
                    <img src="../blog/{post['image']}" alt="{post['title']}">
                    </a></div>
                <div>
                    <a href="{post['id']}.html">
                    <h3>{post['title']}</h3>
                    <p>{post['date']}</p>
                    </a>
                </div>
            </a>
        </div>
        """
    return html

def generate_posts(metadata, template):
    os.makedirs('generated-posts', exist_ok=True)
    
    for post in metadata['posts']:
        post_content = load_post_content(post['id'])
        post_html = template
        
        # Replace placeholders
        post_html = post_html.replace('{TITLE}', post['title'])
        post_html = post_html.replace('{EXCERPT}', post['excerpt'])
        post_html = post_html.replace('{IMAGE}', post['image'])
        post_html = post_html.replace('{URL}', f"https://dlightning.org/blog/post-content/{post['id']}.html")
        post_html = post_html.replace('{DATE}', post['date'])
        post_html = post_html.replace('{AUTHOR}', post['author'])
        post_html = post_html.replace('{AUTHOR_IMAGE}', post['authorImage'])
        post_html = post_html.replace('{CONTENT}', post_content)
        post_html = post_html.replace('{TAGS}', ' '.join([f'<span class="tag">{tag}</span>' for tag in post['tags']]))
        
        related_posts = generate_related_posts(post, metadata['posts'])
        post_html = post_html.replace('{RELATED_POSTS}', related_posts)
        
        # Write the generated HTML to a file
        with open(f"generated-posts/{post['id']}.html", 'w') as f:
            f.write(post_html)

if __name__ == "__main__":
    metadata = load_metadata()
    template = load_template()
    generate_posts(metadata, template)
    print("Blog posts generated successfully!")