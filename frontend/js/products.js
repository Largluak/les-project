class ProductsManager {
  constructor() {
    this.clientId = this.getClientId();
    this.currentPage = 1;
    this.currentFilters = {};
    this.products = [];
    this.currentProduct = null;
    this.init();
  }

  init() {
    this.loadProducts();
    this.setupEventListeners();
  }

  getClientId() {
    return localStorage.getItem("clientId") || "42";
  }

  getDefaultBookImage() {
    // Usa o sistema de configuração de imagens
    if (window.getDefaultBookImage) {
      return window.getDefaultBookImage();
    }

    // Fallback caso o sistema de configuração não esteja disponível
    return "images/default-book.jpg";
  }

  setupEventListeners() {
    // Busca
    document
      .getElementById("search-btn")
      .addEventListener("click", () => this.searchProducts());
    document
      .getElementById("product-search")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.searchProducts();
      });

    // Filtros
    document
      .getElementById("apply-filters")
      .addEventListener("click", () => this.applyFilters());
    document
      .getElementById("clear-filters")
      .addEventListener("click", () => this.clearFilters());

    // Modal
    document
      .getElementById("close-product-modal")
      .addEventListener("click", () => this.hideProductModal());
    document
      .getElementById("close-modal-btn")
      .addEventListener("click", () => this.hideProductModal());
    document
      .getElementById("add-to-cart-btn")
      .addEventListener("click", () => this.addToCart());
  }

  async loadProducts() {
    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 12,
        active: "true",
        ...this.currentFilters,
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/products?${params}`);
      const data = await response.json();

      if (data.success) {
        this.products = data.data.products;
        this.updateProductsGrid();
        this.updatePagination(data.data.pagination);
      } else {
        this.showError("Erro ao carregar produtos: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao carregar produtos: " + error.message);
    }
  }

  updateProductsGrid() {
    const productsGrid = document.getElementById("products-grid");

    if (this.products.length === 0) {
      productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box fa-3x"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Não há produtos que correspondam aos filtros aplicados.</p>
                </div>
            `;
      return;
    }

    productsGrid.innerHTML = this.products
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${this.getDefaultBookImage()}" alt="${
          product.name
        }">
                    <div class="product-overlay">
                        <button class="btn btn-outline btn-sm" onclick="productsManager.viewProduct(${
                          product.id
                        })">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${
                      product.description || "Sem descrição"
                    }</p>
                    <div class="product-price">R$ ${product.price
                      .toFixed(2)
                      .replace(".", ",")}</div>
                    <div class="product-stock">
                        ${
                          product.stock > 0
                            ? `<span class="stock-available"><i class="fas fa-check"></i> Em estoque (${product.stock})</span>`
                            : `<span class="stock-unavailable"><i class="fas fa-times"></i> Sem estoque</span>`
                        }
                    </div>
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="productsManager.decreaseQuantity(${
                              product.id
                            })">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" id="quantity-${
                              product.id
                            }" value="1" min="1" max="${product.stock}">
                            <button class="quantity-btn" onclick="productsManager.increaseQuantity(${
                              product.id
                            })">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="productsManager.addToCart(${
                          product.id
                        })" 
                                ${product.stock === 0 ? "disabled" : ""}>
                            <i class="fas fa-cart-plus"></i> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  updatePagination(pagination) {
    const paginationContainer = document.getElementById("pagination");

    if (pagination.pages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let paginationHTML = '<div class="pagination-controls">';

    // Botão anterior
    if (pagination.page > 1) {
      paginationHTML += `
                <button class="btn btn-outline" onclick="productsManager.goToPage(${
                  pagination.page - 1
                })">
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
            `;
    }

    // Números das páginas
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.pages, pagination.page + 2);

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
                <button class="btn ${
                  i === pagination.page ? "btn-primary" : "btn-outline"
                }" 
                        onclick="productsManager.goToPage(${i})">
                    ${i}
                </button>
            `;
    }

    // Botão próximo
    if (pagination.page < pagination.pages) {
      paginationHTML += `
                <button class="btn btn-outline" onclick="productsManager.goToPage(${
                  pagination.page + 1
                })">
                    Próximo <i class="fas fa-chevron-right"></i>
                </button>
            `;
    }

    paginationHTML += "</div>";
    paginationContainer.innerHTML = paginationHTML;
  }

  goToPage(page) {
    this.currentPage = page;
    this.loadProducts();
  }

  searchProducts() {
    const searchTerm = document.getElementById("product-search").value.trim();
    this.currentFilters.name = searchTerm;
    this.currentPage = 1;
    this.loadProducts();
  }

  applyFilters() {
    this.currentFilters = {
      name: document.getElementById("product-search").value.trim(),
      minPrice: document.getElementById("min-price").value,
      maxPrice: document.getElementById("max-price").value,
      inStock: document.getElementById("stock-filter").value,
    };

    // Remover valores vazios
    Object.keys(this.currentFilters).forEach((key) => {
      if (!this.currentFilters[key]) {
        delete this.currentFilters[key];
      }
    });

    this.currentPage = 1;
    this.loadProducts();
  }

  clearFilters() {
    document.getElementById("product-search").value = "";
    document.getElementById("min-price").value = "";
    document.getElementById("max-price").value = "";
    document.getElementById("stock-filter").value = "";
    this.currentFilters = {};
    this.currentPage = 1;
    this.loadProducts();
  }

  async viewProduct(productId) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/products/${productId}`
      );
      const data = await response.json();

      if (data.success) {
        this.currentProduct = data.data.product;
        this.showProductDetails();
      } else {
        this.showError("Erro ao carregar produto: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao carregar produto: " + error.message);
    }
  }

  showProductDetails() {
    const product = this.currentProduct;

    document.getElementById("modal-product-name").textContent = product.name;

    const productDetails = document.getElementById("product-details");
    productDetails.innerHTML = `
            <div class="product-detail-content">
                <div class="product-detail-image">
                    <img src="${this.getDefaultBookImage()}" alt="${
      product.name
    }">
                </div>
                <div class="product-detail-info">
                    <h4>${product.name}</h4>
                    <p class="product-detail-description">${
                      product.description || "Sem descrição"
                    }</p>
                    <div class="product-detail-price">R$ ${product.price
                      .toFixed(2)
                      .replace(".", ",")}</div>
                    <div class="product-detail-stock">
                        ${
                          product.stock > 0
                            ? `<span class="stock-available"><i class="fas fa-check"></i> Em estoque (${product.stock} unidades)</span>`
                            : `<span class="stock-unavailable"><i class="fas fa-times"></i> Sem estoque</span>`
                        }
                    </div>
                    <div class="product-detail-quantity">
                        <label>Quantidade:</label>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="productsManager.decreaseModalQuantity()">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" id="modal-quantity" value="1" min="1" max="${
                              product.stock
                            }">
                            <button class="quantity-btn" onclick="productsManager.increaseModalQuantity()">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.getElementById("product-modal").style.display = "block";
  }

  hideProductModal() {
    document.getElementById("product-modal").style.display = "none";
    this.currentProduct = null;
  }

  increaseQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    const product = this.products.find((p) => p.id === productId);
    const currentValue = parseInt(input.value);
    const newValue = Math.min(currentValue + 1, product.stock);
    input.value = newValue;
  }

  decreaseQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    const currentValue = parseInt(input.value);
    const newValue = Math.max(currentValue - 1, 1);
    input.value = newValue;
  }

  increaseModalQuantity() {
    const input = document.getElementById("modal-quantity");
    const currentValue = parseInt(input.value);
    const newValue = Math.min(currentValue + 1, this.currentProduct.stock);
    input.value = newValue;
  }

  decreaseModalQuantity() {
    const input = document.getElementById("modal-quantity");
    const currentValue = parseInt(input.value);
    const newValue = Math.max(currentValue - 1, 1);
    input.value = newValue;
  }

  async addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (quantity <= 0) {
      this.showError("Quantidade deve ser maior que zero");
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Produto adicionado ao carrinho!");
        // Resetar quantidade para 1
        quantityInput.value = 1;
      } else {
        this.showError("Erro ao adicionar ao carrinho: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao adicionar ao carrinho: " + error.message);
    }
  }

  async addToCartFromModal() {
    if (!this.currentProduct) return;

    const quantityInput = document.getElementById("modal-quantity");
    const quantity = parseInt(quantityInput.value);

    if (quantity <= 0) {
      this.showError("Quantidade deve ser maior que zero");
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: this.currentProduct.id,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Produto adicionado ao carrinho!");
        this.hideProductModal();
      } else {
        this.showError("Erro ao adicionar ao carrinho: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao adicionar ao carrinho: " + error.message);
    }
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" class="btn btn-sm btn-outline">
                <i class="fas fa-times"></i>
            </button>
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Inicializar quando a página carregar
let productsManager;
document.addEventListener("DOMContentLoaded", () => {
  productsManager = new ProductsManager();
});
