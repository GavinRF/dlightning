let currentIndex = 0;
const postsPerLoad = 6; // even, so the 2-column grid never leaves a lonely gap
let isLoading = false;
let allPosts = [];

// Filter state. Filtering runs against `allPosts` (the full data set), not the
// DOM — otherwise only the handful of posts already paginated in are searchable,
// which is how selecting a tag could wrongly return zero results.
let activeCategory = null;      // single-select
const activeTags = new Set();   // multi-select — tags stack (union / OR)
let searchTerm = '';

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
    updateSearchBar();
    updateCategories();
    updateTagCloud();
    updateArchivePosts();

    // The first page of cards is already visible in the served HTML. Pick the
    // pagination cursor up from the DOM rather than calling renderPosts(),
    // which would hide and re-reveal them and replay the fade-in.
    currentIndex = 0;
    allPosts.forEach(post => {
        const card = cardsById.get(post.id);
        if (card && !card.hidden) currentIndex++;
    });
    syncLoadMoreBtn();
}

// True when any filter is narrowing the feed.
function isFiltering() {
    return activeCategory !== null || activeTags.size > 0 || searchTerm !== '';
}

// Does a post satisfy every active filter? Category ANDs with tags; tags among
// themselves OR (matching any selected tag is enough); search matches title,
// excerpt, or tags.
function postMatches(post) {
    if (activeCategory && post.category !== activeCategory) return false;
    if (activeTags.size > 0 && !post.tags.some(t => activeTags.has(t))) return false;
    if (searchTerm) {
        const haystack = (post.title + ' ' + post.excerpt + ' ' + post.tags.join(' ')).toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
    }
    return true;
}

// The cards are baked into index.html by blog/generate_index.py so that every
// post link is present in the served HTML — building them here meant the page
// shipped with no links to any post, which is what left them "Discovered -
// currently not indexed" in Search Console. This file adopts those nodes
// instead: filtering and pagination toggle `hidden` on cards that already exist.
const cardsById = new Map();

function indexCards() {
    document.querySelectorAll('#blogPosts .blog-item').forEach(card => {
        cardsById.set(card.dataset.id, card);
        initThumb(card);
    });
}

// Reveal the image (and stop the shimmer) once it loads.
function initThumb(card) {
    const thumb = card.querySelector('.blog-post-thumb');
    const img = thumb && thumb.querySelector('img');
    if (!img) return;
    const reveal = () => thumb.classList.add('loaded');
    if (img.complete) {
        reveal();
    } else {
        img.addEventListener('load', reveal);
        img.addEventListener('error', reveal); // don't shimmer forever on a broken image
    }
}

// This script tag sits below #blogPosts, so the cards are already parsed.
indexCards();

// Show or hide a post's card. Missing cards are ignored, which is what happens
// to a post added to the metadata before generate_posts.py has been run.
function setCardVisible(post, visible) {
    const card = cardsById.get(post.id);
    if (card) card.hidden = !visible;
    return !!card;
}

// The button disappears once the whole feed is revealed.
function syncLoadMoreBtn() {
    document.getElementById('loadMoreBtn').style.display =
        currentIndex >= allPosts.length ? 'none' : 'block';
}

// Render the feed for the current filter state. When filtering, every matching
// post is shown at once (no pagination). When not, we paginate as before.
function renderPosts() {
    currentIndex = 0;

    updateActiveFilters();
    markSelections();

    const noResults = document.getElementById('noResults');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (isFiltering()) {
        let matches = 0;
        allPosts.forEach(post => {
            const shown = postMatches(post);
            if (setCardVisible(post, shown) && shown) matches++;
        });
        loadMoreBtn.style.display = 'none';
        noResults.hidden = matches !== 0;
    } else {
        noResults.hidden = true;
        allPosts.forEach(post => setCardVisible(post, false));
        loadMorePosts(); // restores the paginated, unfiltered feed
    }
}

// Reveal the next page of the unfiltered feed. No-op while filtering (the
// filtered view already shows all matches).
function loadMorePosts() {
    if (isLoading || isFiltering()) return;
    isLoading = true;

    const postsToLoad = allPosts.slice(currentIndex, currentIndex + postsPerLoad);
    postsToLoad.forEach(post => setCardVisible(post, true));
    currentIndex += postsToLoad.length;

    isLoading = false;

    syncLoadMoreBtn();
}

// ---- Filter controls -------------------------------------------------------

function toggleTag(tag) {
    if (activeTags.has(tag)) {
        activeTags.delete(tag);
    } else {
        activeTags.add(tag);
    }
    renderPosts();
}

function filterByTag(tag) { toggleTag(tag); } // back-compat alias

function toggleCategory(category) {
    activeCategory = activeCategory === category ? null : category; // click again to unselect
    renderPosts();
}

function filterByCategory(category) { toggleCategory(category); } // back-compat alias

function filterPosts() {
    const input = document.getElementById('searchInput');
    searchTerm = input ? input.value.trim().toLowerCase() : '';
    renderPosts();
}

function clearFilters() {
    activeCategory = null;
    activeTags.clear();
    searchTerm = '';
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    renderPosts();
}

// Reflect the current selection on the category list and tag cloud.
function markSelections() {
    document.querySelectorAll('#categoryList [data-category]').forEach(el => {
        el.classList.toggle('active', activeCategory === el.dataset.category);
    });
    document.querySelectorAll('#tagCloud [data-tag]').forEach(el => {
        el.classList.toggle('active', activeTags.has(el.dataset.tag));
    });
}

// Render the removable-chip summary bar above the feed.
function updateActiveFilters() {
    const bar = document.getElementById('activeFilters');
    if (!bar) return;

    if (!isFiltering()) {
        bar.hidden = true;
        bar.innerHTML = '';
        return;
    }

    const count = allPosts.filter(postMatches).length;
    const chips = [];
    if (activeCategory) {
        chips.push(chip('category', activeCategory, `removeCategory()`));
    }
    activeTags.forEach(tag => {
        chips.push(chip('tag', tag, `removeTag('${cssEscape(tag)}')`));
    });
    if (searchTerm) {
        chips.push(chip('search', `“${searchTerm}”`, `removeSearch()`));
    }

    bar.hidden = false;
    bar.innerHTML = `
        <span class="active-filters-count">${count} ${count === 1 ? 'post' : 'posts'}</span>
        <div class="active-filters-chips">${chips.join('')}</div>
        <button type="button" class="clear-all-btn" onclick="clearFilters()">Clear all</button>
    `;
}

function chip(kind, label, onclick) {
    return `<button type="button" class="filter-chip filter-chip--${kind}" onclick="${onclick}">
        ${label}<span class="filter-chip-x" aria-hidden="true">&times;</span>
    </button>`;
}

// Escape a value for safe embedding inside a single-quoted JS string in HTML.
function cssEscape(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function removeCategory() { activeCategory = null; renderPosts(); }
function removeTag(tag) { activeTags.delete(tag); renderPosts(); }
function removeSearch() {
    searchTerm = '';
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    renderPosts();
}

// ---- Sidebar widgets -------------------------------------------------------

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
        categories[post.category] = (categories[post.category] || 0) + 1;
    });

    for (const [category, count] of Object.entries(categories)) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'cat-link d-flex justify-content-between align-items-center';
        a.dataset.category = category;
        a.innerHTML = `<p>${category}</p><p>(${count})</p>`;
        a.addEventListener('click', (e) => { e.preventDefault(); toggleCategory(category); });
        li.appendChild(a);
        categoryList.appendChild(li);
    }
}

function updateTagCloud() {
    const tagCloud = document.getElementById('tagCloud');
    tagCloud.innerHTML = '';

    const tags = new Set();
    allPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'list-inline-item';
        const a = document.createElement('a');
        a.href = '#';
        a.className = 'tag-cloud-item btn btn-outline-secondary btn-sm mb-2';
        a.dataset.tag = tag;
        a.textContent = tag;
        a.addEventListener('click', (e) => { e.preventDefault(); toggleTag(tag); });
        li.appendChild(a);
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

// Initial display
$(document).ready(function() {
    // Infinite scroll (only meaningful while unfiltered)
    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadMorePosts();
        }
    });
});
