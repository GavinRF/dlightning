let currentIndex = 0;
const postsPerLoad = 6; // even, so the 2-column grid never leaves a lonely gap
let isLoading = false;
let allPosts = [];

// Active filter applied to rendered items. Returns true if an item should show.
let currentFilter = () => true;

// # RUN COMMAND to Generate Posts from MetaData
// # python3 blog/generate_posts.py

// Fetch blog posts metadata
fetch('blog-posts-metadata.json')
    .then(response => response.json())
    .then(data => {
        allPosts = data.posts;
        initializeBlog();
    });

function initializeBlog() {
    const blogPostsContainer = document.getElementById('blogPosts');
    blogPostsContainer.innerHTML = ''; // Clear existing content
    currentIndex = 0;
    loadMorePosts();
    updateArchivePosts();
    updateCategories();
    updateTagCloud();
    updateSearchBar();
}

function loadMorePosts() {
    if (isLoading) return;
    isLoading = true;

    const postsToLoad = allPosts.slice(currentIndex, currentIndex + postsPerLoad);

    if (postsToLoad.length > 0) {
        const blogPostsContainer = document.getElementById('blogPosts');
        postsToLoad.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'mb-2 blog-item';
            postElement.setAttribute('data-category', post.category);
            postElement.setAttribute('data-tags', post.tags.join(' '));
            postElement.innerHTML = `
                <article class="blog-post">
                    <a href="../blog-posts/${post.id}.html">
                        <div class="blog-post-thumb">
                            <img src="${post.image}" alt="${post.title}" class="img-fluid" loading="lazy">
                        </div>
                        <div class="blog-post-content">
                                <h2>${post.title}</h2>
                            <p class="date"><i class="far fa-calendar-alt me-2"></i> ${post.date}</p>
                            <p>${post.excerpt}</p>
                            <div class="tags">
                                ${post.tags.map(tag => `<span class="tag"><i class="fas fa-tag me-1"></i>&nbsp;${tag}</span>`).join('')}
                            </div>
                        </div>
                    </a>
                </article>
            `;
            // Respect the active filter for newly loaded items.
            postElement.style.display = currentFilter(postElement) ? '' : 'none';
            blogPostsContainer.appendChild(postElement);

            // Reveal the image (and stop the shimmer) once it loads.
            const thumb = postElement.querySelector('.blog-post-thumb');
            const img = thumb.querySelector('img');
            const reveal = () => thumb.classList.add('loaded');
            if (img.complete) {
                reveal();
            } else {
                img.addEventListener('load', reveal);
                img.addEventListener('error', reveal); // don't shimmer forever on a broken image
            }
        });
        currentIndex += postsToLoad.length;
    }

    isLoading = false;

    if (currentIndex >= allPosts.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        document.getElementById('loadMoreBtn').style.display = 'block';
    }
}

// Apply the current filter to every rendered item by toggling visibility.
function applyFilter() {
    document.querySelectorAll('#blogPosts .blog-item').forEach(item => {
        item.style.display = currentFilter(item) ? '' : 'none';
    });
}

function updateArchivePosts() {
    const archivePostsContainer = document.getElementById('archivePosts');
    archivePostsContainer.innerHTML = '';

    // allPosts is newest-first. Skip the posts already visible at the top of the
    // feed so the archive surfaces older writing the reader would otherwise miss.
    const pool = allPosts.slice(postsPerLoad);
    const archivePosts = sampleRandom(pool.length ? pool : allPosts, 4);

    archivePosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'media post_item';
        postElement.innerHTML = `
            <a href="../blog-posts/${post.id}.html">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </a>
            <div class="media-body ms-3">
                <a href="../blog-posts/${post.id}.html"><h3>${post.title}</h3></a>
                <small>${post.date}</small>
            </div>
        `;
        archivePostsContainer.appendChild(postElement);
    });
}

// Return up to `count` items picked at random from `items`, without mutating it.
function sampleRandom(items, count) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
}

function updateCategories() {
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';

    const categories = {};
    allPosts.forEach(post => {
        if (categories[post.category]) {
            categories[post.category]++;
        } else {
            categories[post.category] = 1;
        }
    });

    for (const [category, count] of Object.entries(categories)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="d-flex justify-content-between" onclick="filterByCategory('${category}')">
                <p>${category}</p>
                <p>(${count})</p>
            </a>
        `;
        categoryList.appendChild(li);
    }
}

function updateTagCloud() {
    const tagCloud = document.getElementById('tagCloud');
    tagCloud.innerHTML = '';

    const tags = new Set();
    allPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'list-inline-item';
        li.innerHTML = `<a href="#" class="btn btn-outline-secondary btn-sm mb-2" onclick="filterByTag('${tag}')">${tag}</a>`;
        tagCloud.appendChild(li);
    });
}

function updateSearchBar() {
    const searchWidget = document.querySelector('.search_widget');
    searchWidget.innerHTML = `
        <form action="#" onsubmit="return false;">
            <div class="form-group">
                <div class="search-input mb-3">
                    <input type="text" id="searchInput" class="form-control" placeholder='Search Keyword' oninput="filterPosts()">
                    <span class="search-icon">
                        <i class="fas fa-search" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        </form>
    `;
}

function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentFilter = (item) => {
        const title = item.querySelector('h2').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const tags = item.getAttribute('data-tags').toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm);
    };
    applyFilter();
}

function filterByCategory(category) {
    currentFilter = (item) => item.getAttribute('data-category') === category;
    applyFilter();
}

function filterByTag(tag) {
    currentFilter = (item) => item.getAttribute('data-tags').toLowerCase().includes(tag.toLowerCase());
    applyFilter();
}

// Initial display
$(document).ready(function() {
    // Infinite scroll
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadMorePosts();
        }
    });
});
