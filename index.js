// ==================================== Dark Mode =============================================================
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === "dark") {
        icon.classList.replace("fa-sun", "fa-moon");
    } else {
        icon.classList.replace("fa-moon", "fa-sun");
    }
} else {
    body.classList.add("light");
    icon.classList.add("fa-sun"); 
}

themeToggle.addEventListener("click", () => {
    if (body.classList.contains("light")) {
        body.classList.replace("light", "dark");
        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.replace("dark", "light");
        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "light");
    }
});


//========================================================================================================


// ==================================== Welcome Message =============================================================
const welcomeModal = document.getElementById("welcomeModal");
const closeModalBtn = document.getElementById("closeModal");
const startExploringBtn = document.getElementById("startExploring");

window.addEventListener("load", () => {
    // Show modal after load
    setTimeout(() => {
        if(welcomeModal) welcomeModal.classList.add("active");
    }, 1000);
});

if(closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        welcomeModal.classList.remove("active");
    });
}

if(startExploringBtn) {
    startExploringBtn.addEventListener("click", () => {
        welcomeModal.classList.remove("active");
    });
}
//========================================================================================================


// ==================================== Products, Cart & Favorites  =============================================================
const container = document.getElementById("container");
const spinner = document.getElementById("loading-screen");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sort-select");
const searchInput = document.getElementById("searchInput");
let products = [];

const cartCount = document.getElementById("cart-count");
const favoriteCount = document.getElementById("favorite-count"); 
let favorites = JSON.parse(localStorage.getItem("favorites")) || []; 

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if(cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

function updateFavoriteCount() {
    if(favoriteCount) favoriteCount.textContent = favorites.length;
}
updateFavoriteCount(); 
//========================================================================================================


// ========================= Load & Save Filters ===============================
function loadSavedFilters() {
    const savedCategory = localStorage.getItem("selectedCategory");
    const savedSort = localStorage.getItem("selectedSort");
    const savedSearch = localStorage.getItem("searchValue");

    if (savedCategory && categoryFilter) categoryFilter.value = savedCategory;
    if (savedSort && sortFilter) sortFilter.value = savedSort;
    if (savedSearch && searchInput) searchInput.value = savedSearch;
}

function saveFilters() {
    if (categoryFilter) localStorage.setItem("selectedCategory", categoryFilter.value);
    if (sortFilter) localStorage.setItem("selectedSort", sortFilter.value);
    if (searchInput) localStorage.setItem("searchValue", searchInput.value.trim());
}
// ============================================================================


//===============================  Fetch Products ==============================================
const getProducts = async () => {
    if(!container) return; 
    try {
        if(spinner) spinner.style.display = "block";
        const response = await fetch("https://dummyjson.com/products?limit=2000");
        const data = await response.json();
        products = data.products;

        populateCategories();

        loadSavedFilters();

        filterAndSortProducts();

        if(spinner) spinner.style.display = "none";
    } catch (error) {
        if(spinner) spinner.style.display = "none";
        container.innerHTML = `<p style='font-size:18px; color: red;'>Failed to load products.</p>`;
        console.error(error);
    }
};
getProducts();
//========================================================================================================


//=============================== Populate Categories =========================================
function populateCategories() {
    if (!categoryFilter) return;

    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoryFilter.appendChild(option);
    });
}
//========================================================================================================


// =========================== Display Products ==============================================
function displayProducts(list) {
    if(!container) return;
    container.innerHTML = "";
    if (!list || list.length === 0) {
        container.innerHTML = "<p style='font-size:18px'>No products found.</p>";
        return;
    }

    list.forEach(product => {
        const isFavorite = favorites.some(item => item.id === product.id);
        const favoriteIconClass = isFavorite ? 'fas fa-heart' : 'far fa-heart';

        const card = document.createElement("div");
        card.className = "products-cards";
        card.innerHTML = `
            <div class="products-images">
                <img src="${product.thumbnail}" alt="${product.title}">
                
                <div class="favorite-toggle" onclick="toggleFavorite(${product.id})">
                    <i id="fav-icon-${product.id}" class="${favoriteIconClass}"></i>
                </div>

            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.title}</h3>

                <p class="product-description">${product.description}</p>

                <div class="product-rating">${generateStars(product.rating)}</div>

                <div class="product-price">${product.price}</div>

                <button onclick="addToCart(${product.id})" class="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}
//========================================================================================================


// =================================== Toggle Favorite  ==================================
function toggleFavorite(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingIndex = favorites.findIndex(item => item.id === id);
    const iconElement = document.getElementById(`fav-icon-${id}`);

    if (existingIndex > -1) {
        // Remove product
        favorites.splice(existingIndex, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        
        if(iconElement) iconElement.classList.replace("fas", "far"); 

        Swal.fire({
            title: "Removed!",
            text: `${product.title} has been removed from your favorites.`,
            icon: "info",
            timer: 1500,
            showConfirmButton: false
        });

    } else {

        // Add product
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));

        if(iconElement) iconElement.classList.replace("far", "fas");
        
        Swal.fire({
            title: "Added to Favorites!",
            text: `${product.title} has been added to your favorites.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    }

    updateFavoriteCount();
}
//========================================================================================================


// =================================  Star Rating =============================================
function generateStars(rate) {
    let stars = "";
    const full = Math.floor(rate);
    for (let i = 0; i < full; i++) stars += '<i class="fas fa-star"></i>';
    if (rate % 1 !== 0) stars += '<i class="fas fa-star-half-alt"></i>';
    return stars;
}
//===========================================================================================================


//=============================== filter . sort . search ===============================================
function filterAndSortProducts() {
    let filtered = [...products];

    // Search
    const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";
    if (searchValue)
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchValue));

    // Category
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";
    if (selectedCategory !== "all")
        filtered = filtered.filter(p => p.category === selectedCategory);

    // Sort
    const sortValue = sortFilter ? sortFilter.value : "";
    if (sortValue === "price-asc")
        filtered.sort((a, b) => a.price - b.price);

    else if (sortValue === "price-desc")
        filtered.sort((a, b) => b.price - a.price);

    else if (sortValue === "rating-desc")
        filtered.sort((a, b) => b.rating - a.rating);

    displayProducts(filtered);
}
//===========================================================================================================


// ================================ Event Listeners ==================================================
if(searchInput) {
    searchInput.addEventListener("input", () => {
        saveFilters();
        filterAndSortProducts();
    });
}

if(categoryFilter) {
    categoryFilter.addEventListener("change", () => {
        saveFilters();
        filterAndSortProducts();
    });
}

if(sortFilter) {
    sortFilter.addEventListener("change", () => {
        saveFilters();
        filterAndSortProducts();
    });
}
//========================================================================================================


//=======================================  swiper  =========================================================================================================================
if (document.querySelector(".mySwiper")) {
    const swiper = new Swiper(".mySwiper", {
        loop: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        
         navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        }, 
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    window.addEventListener('load', () => {
        swiper.update();
    });
}


// ========================= Add to Cart  ===================================================================
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
        Swal.fire({
            title: "Already in Cart!",
            text: `${product.title} is already in your cart.`,
            icon: "info",
            confirmButtonText: "Got it"
        });
        return;
    }

    cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    Swal.fire({
        title: "Added to Cart!",
        text: `${product.title} has been added to your cart.`,
        icon: "success",
        confirmButtonText:" OK"
    });
}