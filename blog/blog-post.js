// Renders the Recent Posts sidebar on each post page from
// blog-posts-metadata.json, client-side.
//
// Recent Posts stays client-side on purpose: it is the newest three, so it
// changes on every publish and baking it in would rewrite all 35 post pages
// each time. Related Posts and the prev/next links ARE baked in by
// blog/generate_posts.py — those are what give Google a crawlable path between
// posts, and they only churn the handful of pages whose neighbours changed.

(function () {
    // Post pages live at /blog-posts/<id>.html, so the id is the filename.
    const currentId = location.pathname.split('/').pop().replace(/\.html$/, '');

    fetch('../blog/blog-posts-metadata.json')
        .then(response => response.json())
        .then(data => renderRecentPosts(data.posts || []))
        .catch(() => { /* leave the sidebar empty if metadata can't load */ });

    // Posts are stored newest-first, the same assumption blog-list.js relies on.
    function renderRecentPosts(posts) {
        const container = document.querySelector('.recent-posts-container');
        if (!container) return;
        const recent = posts.filter(p => p.id !== currentId).slice(0, 3);
        container.innerHTML = recent.map(post => `
        <div class="recent-post">
            <div>
                <a href="${post.id}.html">
                    <img src="../blog/${post.image}" alt="${post.title}">
                </a>
            </div>
            <div>
                <a href="${post.id}.html">
                    <h3>${post.title}</h3>
                    <small>${post.date}</small>
                </a>
            </div>
        </div>
        `).join('');
    }
})();
