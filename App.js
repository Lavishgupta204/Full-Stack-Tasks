const API_URL = "https://dummyjson.com/products?limit=194";

const productContainer = document.getElementById("products");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");

let allProducts = [];
let filteredProducts = [];

// Fetch Products
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allProducts = data.products;
    filteredProducts = [...allProducts];

    loadCategories();
    displayProducts(filteredProducts);
  } catch (error) {
    console.log(error);
    productContainer.innerHTML = "<h2>Failed to load products.</h2>";
  }
}

// Display Products
function displayProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = "<h2>No Products Found</h2>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <div class="product-info">
        <h3>${product.title}</h3>
        <p>${product.category}</p>
        <p class="price">$${product.price}</p>
        <p class="rating">⭐ ${product.rating}</p>
        <button class="add-cart">Add to Cart</button>
      </div>
    `;

    // Product Details Page
    card.addEventListener("click", () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    // Add to Cart
    card.querySelector(".add-cart").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    productContainer.appendChild(card);
  });
}

// Categories
function loadCategories() {
  const categories = [...new Set(allProducts.map((p) => p.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

// Search + Filter + Sort
function filterProducts() {
  const searchValue = searchInput.value.toLowerCase();
  const category = categorySelect.value;
  const sort = sortSelect.value;

  filteredProducts = allProducts.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(searchValue);

    const matchCategory =
      category === "all" || product.category === category;

    return matchSearch && matchCategory;
  });

  if (sort === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayProducts(filteredProducts);
}

// Add to Cart
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product Added to Cart");
}

// Go to Cart
function goToCart() {
  window.location.href = "cart.html";
}

// Events
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
sortSelect.addEventListener("change", filterProducts);

// Load Products
fetchProducts();
