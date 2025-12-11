
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






// ========================= Cart Page ==================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("summaryy-total");
const updateCartCount = () => {
    const countElement = document.getElementById("cart-count");
    if(countElement) countElement.textContent = cart.length;
};
updateCartCount();

const updateFavoriteCount = () => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const countElement = document.getElementById("favorite-count");
    if(countElement) countElement.textContent = favorites.length;
};
updateFavoriteCount();
//========================================================================================================














//======================= Render Cart ============================================================
function renderCart() {
    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    if (cart.length === 0) {
        cartContainer.innerHTML = `<p style="padding:20px;">Cart is empty.</p>`;
        totalEl.textContent = "$0.00";
        updateCartCount();
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-itemss";
        div.innerHTML = `
            <div class="product-infoo">
                <img src="${item.thumbnail}" alt="${item.title}" class="product-imagee"/>
                <div class="product-detailss">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                </div>
            </div>
            <div class="pricee">$${item.price}</div>
            <div class="quantity-controlss">
                <button onclick="decrease(${index})">-</button>
                <input type="text" value="${item.quantity}" disabled/>
                <button onclick="increase(${index})">+</button>
            </div>
            <div class="price">
                <button onclick="removeItem(${index})">🗑️</button>
            </div>
        `;
        cartContainer.appendChild(div);
    });

    updateSummary();
    updateCartCount();
}









// =============================== increase & decrease  =========================================
function decrease(index) {
    if(cart[index].quantity > 1) cart[index].quantity--;
    saveCart();
}
function increase(index) {
    cart[index].quantity++;
    saveCart();
}

// Remove
function removeItem(index) {
    const product = cart[index];
    Swal.fire({
        title: "Do you want to remove this item?",
        text: `${product.title} It has been delete!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
    }).then(result => {
        if(result.isConfirmed) {
            cart.splice(index, 1);
            saveCart();
            Swal.fire({ title: "Its Deleted!", 
                text: `${product.title} has been removed from the cart`,
                 icon: "success",
                  confirmButtonText:"ok" });
        }
    });
}


function updateSummary() {
    let total = 0;
    for(const item of cart) total += item.price * item.quantity;
    totalEl.textContent = `Total $${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

renderCart();
updateCartCount();