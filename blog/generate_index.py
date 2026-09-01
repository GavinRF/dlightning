"""Bakes the blog feed's post cards into blog/index.html.

The feed used to be built entirely at runtime by blog-list.js, which meant the
served HTML contained no links to any post — Google discovered them from the
sitemap and then had no internal-link signal to justify crawling them ("Discovered
- currently not indexed"). Writing the cards at generate time puts all of them in
the HTML; blog-list.js adopts those nodes and takes over filtering from there.

The markup here is the markup blog-list.js used to build, so the rendered page is
unchanged. Cards past the first page ship with `hidden` set, which is exactly the
state "Load More" toggles.
"""

import html
import re

POSTS_PER_LOAD = 6  # must match postsPerLoad in blog-list.js

START = "<!-- POSTS:START -->"
END = "<!-- POSTS:END -->"

INDEX_PATH = "blog/index.html"


def attr(value):
    """Escape a value for use inside a double-quoted HTML attribute."""
    return html.escape(str(value), quote=True)


def render_card(post, hidden):
    tags = "".join(
        f'<span class="tag"><i class="fas fa-tag me-1"></i>&nbsp;{html.escape(t)}</span>'
        for t in post.get("tags", [])
    )
    hidden_attr = " hidden" if hidden else ""
    # Image paths in the feed are relative to /blog/, the same base blog-list.js
    # used when it built these cards client-side.
    return f'''<div class="mb-2 blog-item" data-id="{attr(post['id'])}" data-category="{attr(post['category'])}" data-tags="{attr(' '.join(post.get('tags', [])))}"{hidden_attr}>
            <article class="blog-post">
                <a href="../blog-posts/{attr(post['id'])}.html">
                    <div class="blog-post-thumb">
                        <img src="{attr(post['image'])}" alt="{attr(post['title'])}" class="img-fluid" loading="lazy">
                    </div>
                    <div class="blog-post-content">
                        <h2>{html.escape(post['title'])}</h2>
                        <p class="date"><i class="far fa-calendar-alt me-2"></i> {html.escape(post['date'])}</p>
                        <p>{html.escape(post['excerpt'])}</p>
                        <div class="tags">
                            {tags}
                        </div>
                    </div>
                </a>
            </article>
        </div>'''


def build_cards(metadata):
    posts = metadata["posts"]
    return "\n        ".join(
        render_card(post, hidden=i >= POSTS_PER_LOAD) for i, post in enumerate(posts)
    )


def write_index(metadata):
    with open(INDEX_PATH, "r") as f:
        page = f.read()

    if START not in page or END not in page:
        raise SystemExit(
            f"{INDEX_PATH} is missing the {START} / {END} markers — cannot bake the feed."
        )

    cards = build_cards(metadata)
    block = f"{START}\n        {cards}\n        {END}"
    updated = re.sub(
        re.escape(START) + r".*?" + re.escape(END), lambda _: block, page, flags=re.S
    )

    if updated == page:
        return len(metadata["posts"]), False
    with open(INDEX_PATH, "w") as f:
        f.write(updated)
    return len(metadata["posts"]), True
