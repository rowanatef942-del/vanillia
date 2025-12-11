// ============================== Dark Mode and Light Mode =======================================================//
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


// ========================= Favorites Logic & Setup ======================================================
const favoriteContainer = document.getElementById("favorites-items"); 
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const updateFavoriteCount = () => {
    const countElement = document.getElementById("favorite-count");
    if(countElement) countElement.textContent = favorites.length;
};
updateFavoriteCount();

const updateCartCount = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElement = document.getElementById("cart-count");
    if(countElement) countElement.textContent = cart.length;
};
updateCartCount();




// ========================= Remove Item Function =========================================================
function removeItem(idToRemove) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff5722',
        cancelButtonColor: '#777',
        confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
        if (result.isConfirmed) {
        
            favorites = favorites.filter(item => item.id !== idToRemove);
            
        
            localStorage.setItem("favorites", JSON.stringify(favorites));
            
            
            renderFavorites();
            updateFavoriteCount();
            
            Swal.fire(
                'Removed!',
                'The item has been removed from your favorites.',
                'success'
            )
        }
    });
}

// ========================= Render Favorites List ========================================================
function renderFavorites() {
    if (!favoriteContainer) return;

    favoriteContainer.innerHTML = "";
    if (favorites.length === 0) {
        favoriteContainer.innerHTML = "<p class='empty-message'>Your favorites list is empty.</p>"; 
        return;
    }

    favorites.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "favorite-item"; 

        itemDiv.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}"> 
            <div class="favorite-details">
                <h3>${item.title}</h3>
                <p>Price: $${item.price}</p>
            </div>
            <div class="remove-container">
                <button class="remove-favorite-btn" onclick="removeItem(${item.id})"> 
                    <i class="fas fa-trash-alt"></i> 
                </button>
            </div>
        `;
        favoriteContainer.appendChild(itemDiv);

        
    });
}

renderFavorites();
//========================================================================================================













