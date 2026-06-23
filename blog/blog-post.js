// Renders the Recent Posts and Related Posts sidebars on each post page from
// blog-posts-metadata.json, client-side. Keeping these out of the generated
// HTML means publishing a new post no longer rewrites every existing page —
// only the new page is created. Mirrors the data-driven approach in blog-list.js.

(function () {
    // Post pages live at /blog-posts/<id>.html, so the id is the filename.
    const currentId = location.pathname.split('/').pop().replace(/\.html$/, '');

    fetch('../blog/blog-posts-metadata.json')
        .then(response => response.json())
        .then(data => {
            const posts = data.posts || [];
            const current = posts.find(p => p.id === currentId);
            renderRecentPosts(posts);
            renderRelatedPosts(posts, current);
        })
        .catch(() => { /* leave the sidebars empty if metadata can't load */ });

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

    function renderRelatedPosts(posts, current) {
        const container = document.querySelector('#moreRelatedPosts .row');
        if (!container || !current) return;

        const LIMIT = 6;
        const candidates = posts.filter(p => p.id !== currentId);

        // Primary match: same category. When a category is thin (or has only
        // this post), fall back to posts that share the most tags, so the
        // section never renders empty.
        const sameCategory = candidates.filter(p => p.category === current.category);
        const related = sameCategory.slice(0, LIMIT);

        if (related.length < LIMIT) {
            const currentTags = new Set(current.tags || []);
            const chosen = new Set(related.map(p => p.id));
            const byTags = candidates
                .filter(p => !chosen.has(p.id))
                .map(p => ({ post: p, shared: (p.tags || []).filter(t => currentTags.has(t)).length }))
                .filter(x => x.shared > 0)
                .sort((a, b) => b.shared - a.shared);
            for (const { post } of byTags) {
                if (related.length >= LIMIT) break;
                related.push(post);
            }
        }

        if (!related.length) return;
        container.innerHTML = related.map(post => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="related-post">
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
        </div>
        `).join('');
    }
})();
