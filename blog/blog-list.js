const blogPosts = [
    {
        date: "03/15/2024",
        title: "Getting Started with Web Development",
        image: "img/single_blog_5.png",
        description: "Learn the basics of HTML, CSS, and JavaScript to kickstart your web development journey.",
        tags: ["Web Development", "HTML", "CSS", "JavaScript"],
        category: "Web Development",
        link: "../index.html"
    },
    {
        date: "03/10/2024",
        title: "The Power of React",
        image: "img/single_blog_5.png",
        description: "Discover why React is one of the most popular JavaScript libraries for building user interfaces.",
        tags: ["React", "JavaScript", "Frontend"],
        category: "Frontend",
        link: "../index.html"
    },
    {
        date: "03/05/2024",
        title: "Mastering CSS Grid",
        image: "img/single_blog_5.png",
        description: "Take your layout skills to the next level with CSS Grid, the most powerful layout system available in CSS.",
        tags: ["CSS", "Layout", "Web Design"],
        category: "CSS",
        link: "../index.html"
    },
    {
        date: "02/28/2024",
        title: "Introduction to Node.js",
        image: "img/single_blog_5.png",
        description: "Learn how to use JavaScript on the server-side with Node.js and build scalable network applications.",
        tags: ["Node.js", "JavaScript", "Backend"],
        category: "Backend",
        link: "../index.html"
    },
    {
        date: "02/22/2024",
        title: "Responsive Web Design Techniques",
        image: "img/single_blog_5.png",
        description: "Explore various techniques to create websites that look great on any device, from mobile to desktop.",
        tags: ["Responsive Design", "CSS", "Web Design"],
        category: "Web Design",
        link: "../index.html"
    },
    {
        date: "02/15/2024",
        title: "Understanding RESTful APIs",
        image: "img/single_blog_5.png",
        description: "Get to grips with RESTful API principles and learn how to design and consume APIs effectively.",
        tags: ["API", "REST", "Web Development"],
        category: "Web Development",
        link: "../index.html"
    },
    {
        date: "02/10/2024",
        title: "The Basics of Version Control with Git",
        image: "img/single_blog_5.png",
        description: "Learn how to track and manage your code changes efficiently using Git and GitHub.",
        tags: ["Git", "Version Control", "GitHub"],
        category: "Version Control",
        link: "../index.html"
    }
];

let $grid;
let currentIndex = 0;
const postsPerLoad = 5;
let isLoading = false;

function displayBlogPosts(posts) {
    const blogPostsContainer = document.getElementById('blogPosts');
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'mb-2 blog-item';
        postElement.setAttribute('data-category', post.category);
        postElement.setAttribute('data-tags', post.tags.join(' '));
        postElement.innerHTML = `
            <article class="blog-post">
                <a href="${post.link}">
                    <img src="${post.image}" alt="${post.title}" class="img-fluid" loading="lazy">
                </a>
                <div class="blog-post-content">
                    <a href="${post.link}">
                        <h2>${post.title}</h2>
                    </a>
                    <p class="date"><i class="far fa-calendar-alt me-2"></i> ${post.date}</p>
                    <p>${post.description}</p>
                    <div class="tags">
                        ${post.tags.map(tag => `<span class="tag"><i class="fas fa-tag me-1"></i> ${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `;
        blogPostsContainer.appendChild(postElement);
    });

    if ($grid) {
        $grid.isotope('reloadItems').isotope();
    }
}

function loadMorePosts() {
    if (isLoading) return;
    isLoading = true;

    const filteredPosts = getFilteredPosts();
    const postsToLoad = filteredPosts.slice(currentIndex, currentIndex + postsPerLoad);
    
    if (postsToLoad.length > 0) {
        displayBlogPosts(postsToLoad);
        currentIndex += postsToLoad.length;
    }

    isLoading = false;

    if (currentIndex >= filteredPosts.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    } else {
        document.getElementById('loadMoreBtn').style.display = 'block';
    }
}

function getFilteredPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    return blogPosts.filter(post => {
        const title = post.title.toLowerCase();
        const description = post.description.toLowerCase();
        const tags = post.tags.join(' ').toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm);
    });
}

function filterPosts() {
    currentIndex = 0;
    document.getElementById('blogPosts').innerHTML = '';
    loadMorePosts();
}

function updateRecentPosts() {
    const recentPostsContainer = document.getElementById('recentPosts');
    recentPostsContainer.innerHTML = '';

    const recentPosts = blogPosts.slice(0, 4);
    recentPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'media post_item';
        postElement.innerHTML = `
            <a href="${post.link}">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </a>
            <div class="media-body ms-3">
                <a href="${post.link}"><h3>${post.title}</h3></a>
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
    blogPosts.forEach(post => {
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
    blogPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'list-inline-item';
        li.innerHTML = `<a href="#" class="btn btn-outline-secondary btn-sm mb-2" onclick="filterByTag('${tag}')">${tag}</a>`;
        tagCloud.appendChild(li);
    });
}

function initIsotope() {
    $grid = $('#blogPosts').isotope({
        itemSelector: '.blog-item',
        layoutMode: 'fitRows'
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

// Initial display
$(document).ready(function() {
    updateSearchBar();
    updateRecentPosts();
    updateCategories();
    updateTagCloud();
    
    loadMorePosts();

    // Infinite scroll
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadMorePosts();
        }
    });

    // Wait for images to load before initializing Isotope
    $('#blogPosts').imagesLoaded(function() {
        initIsotope();
    });
});

// Reinitialize Isotope on window resize
$(window).on('resize', function() {
    if ($grid) {
        $grid.isotope('reloadItems').isotope();
    }
});