let $grid;
let currentIndex = 0;
const postsPerLoad = 5;
let isLoading = false;
let allPosts = [];

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
    updateRecentPosts();
    updateCategories();
    updateTagCloud();
    updateSearchBar();
    // initIsotope();
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
                    <a href="../generated-posts/${post.id}.html">
                        <img src="${post.image}" alt="${post.title}" class="img-fluid">
                    </a>
                    <div class="blog-post-content">
                        <a href="../generated-posts/${post.id}.html">
                            <h2>${post.title}</h2>
                        </a>
                        <p class="date"><i class="far fa-calendar-alt me-2"></i> ${post.date}</p>
                        <p>${post.excerpt}</p>
                        <div class="tags">
                            ${post.tags.map(tag => `<span class="tag"><i class="fas fa-tag me-1"></i>&nbsp;${tag}</span>`).join('')}
                        </div>
                    </div>
                </article>
            `;
            blogPostsContainer.appendChild(postElement);
        });
        currentIndex += postsToLoad.length;
        $('#blogPosts').imagesLoaded(function() {
            if ($grid) {
                $grid.isotope('reloadItems').isotope();
            } else {
                initIsotope();
            }
        });
    }

    isLoading = false;

    if (currentIndex >= allPosts.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        document.getElementById('loadMoreBtn').style.display = 'block';
    }
}

function updateRecentPosts() {
    const recentPostsContainer = document.getElementById('recentPosts');
    recentPostsContainer.innerHTML = '';

    const recentPosts = allPosts.slice(0, 4);
    recentPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'media post_item';
        postElement.innerHTML = `
            <a href="generated-posts/${post.id}.html">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </a>
            <div class="media-body ms-3">
                <a href="generated-posts/${post.id}.html"><h3>${post.title}</h3></a>
                <p>${post.date}</p>
            </div>
        `;
        recentPostsContainer.appendChild(postElement);
    });
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
    $grid.isotope({ filter: function() {
        const title = $(this).find('h2').text().toLowerCase();
        const description = $(this).find('p').text().toLowerCase();
        const tags = $(this).attr('data-tags').toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm);
    }});
}

function filterByCategory(category) {
    $grid.isotope({ filter: `[data-category="${category}"]` });
}

function filterByTag(tag) {
    $grid.isotope({ filter: function() {
        return $(this).attr('data-tags').toLowerCase().includes(tag.toLowerCase());
    }});
}

function initIsotope() {
    $grid = $('#blogPosts').isotope({
        itemSelector: '.blog-item',
        layoutMode: 'fitRows'
    });
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

// Reinitialize Isotope on window resize
$(window).on('resize', function() {
    if ($grid) {
        $grid.isotope('reloadItems').isotope();
    }
});