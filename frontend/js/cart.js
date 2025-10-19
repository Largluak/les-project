class CartManager {
  constructor() {
    this.clientId = this.getClientId();
    this.cart = null;
    this.expirationTimer = null;
    this.init();
  }

  init() {
    this.loadCart();
    this.setupEventListeners();
    this.startExpirationCheck();
  }

  getClientId() {
    // Em um sistema real, isso viria da sessão do usuário
    // Usando cliente existente no banco (ID 42)
    return localStorage.getItem("clientId") || "42";
  }

  getDefaultBookImage() {
    // Usa o sistema de configuração de imagens
    if (window.getDefaultBookImage) {
      return window.getDefaultBookImage();
    }

    // Fallback caso o sistema de configuração não esteja disponível
    return "images/image_books.jpg";
  }

  setupEventListeners() {
    // Botão limpar carrinho
    document.getElementById("clear-cart").addEventListener("click", () => {
      this.showConfirmModal("Tem certeza que deseja limpar o carrinho?", () => {
        this.clearCart();
      });
    });

    // Botão renovar carrinho
    document.getElementById("renew-cart").addEventListener("click", () => {
      this.renewCart();
    });

    // Botão finalizar compra
    document
      .getElementById("proceed-checkout")
      .addEventListener("click", () => {
        this.proceedToCheckout();
      });

    // Modal de confirmação
    document.getElementById("confirm-cancel").addEventListener("click", () => {
      this.hideConfirmModal();
    });

    document.getElementById("confirm-ok").addEventListener("click", () => {
      this.confirmAction();
    });

    // Fechar notificação
    document
      .getElementById("dismiss-notification")
      .addEventListener("click", () => {
        this.hideExpirationNotification();
      });
  }

  async loadCart() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}`
      );
      const data = await response.json();

      if (data.success) {
        this.cart = data.data.cart;
        this.updateCartDisplay();
        this.updateSummary(data.data.totals);
      } else {
        this.showError("Erro ao carregar carrinho: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao carregar carrinho: " + error.message);
    }
  }

  updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyCart = document.getElementById("empty-cart");
    const cartContent = document.getElementById("cart-content");

    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      emptyCart.style.display = "block";
      cartContent.style.display = "none";
      return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "block";

    cartItemsContainer.innerHTML = this.cart.items
      .map(
        (item) => `
            <div class="cart-item" data-product-id="${item.productId}">
                <div class="item-image">
                    <img src="${this.getDefaultBookImage()}" alt="${
          item.product.name
        }">
                </div>
                <div class="item-details">
                    <h3>${item.product.name}</h3>
                    <p class="item-description">${
                      item.product.description || "Sem descrição"
                    }</p>
                    <div class="item-price">R$ ${item.price
                      .toFixed(2)
                      .replace(".", ",")}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${
                      item.productId
                    }, ${Math.max(item.quantity - 1, 0)})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="cartManager.updateQuantity(${
                             item.productId
                           }, Math.max(parseInt(this.value) || 1, 0))">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${
                      item.productId
                    }, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total">
                    R$ ${(item.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-danger" onclick="cartManager.removeItem(${
                      item.productId
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join("");
  }

  updateSummary(totals) {
    document.getElementById("subtotal").textContent = `R$ ${totals.subtotal
      .toFixed(2)
      .replace(".", ",")}`;

    // Calcular frete usando a mesma lógica do checkout
    const shipping = this.calculateShipping();
    const shippingElement = document.getElementById("shipping");
    if (shippingElement) {
      shippingElement.textContent = `R$ ${shipping
        .toFixed(2)
        .replace(".", ",")}`;
    }

    // Recalcular total incluindo frete
    const totalWithShipping = totals.subtotal + shipping;
    document.getElementById("total").textContent = `R$ ${totalWithShipping
      .toFixed(2)
      .replace(".", ",")}`;
    document.getElementById(
      "item-count"
    ).textContent = `${totals.totalQuantity} itens`;

    const proceedButton = document.getElementById("proceed-checkout");
    proceedButton.disabled = totals.totalQuantity === 0;
  }

  calculateShipping() {
    // Mesma lógica de cálculo de frete do checkout
    if (!this.cart || !this.cart.items) return 0;

    const totalWeight = this.cart.items.reduce(
      (sum, item) => sum + item.quantity * 0.5,
      0
    );
    const baseRate = 10;
    const weightRate = totalWeight * 2;
    const distanceRate = 5;

    return baseRate + weightRate + distanceRate;
  }

  async updateQuantity(productId, quantity) {
    if (quantity < 0) return;

    // Se quantidade for 0, mostrar modal de confirmação para remover
    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}/items`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.updateSummary(data.data.totals);
        this.updateItemQuantity(productId, quantity); // Atualizar apenas o item específico
      } else {
        this.showError("Erro ao atualizar quantidade: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao atualizar quantidade: " + error.message);
    }
  }

  updateItemQuantity(productId, newQuantity) {
    // Encontra o item no carrinho e atualiza sua quantidade
    if (this.cart && this.cart.items) {
      const item = this.cart.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = newQuantity;

        // Atualiza apenas o input de quantidade e o total do item específico
        const cartItem = document.querySelector(
          `[data-product-id="${productId}"]`
        );
        if (cartItem) {
          const quantityInput = cartItem.querySelector('input[type="number"]');
          const itemTotal = cartItem.querySelector(".item-total");

          if (quantityInput) {
            quantityInput.value = newQuantity;
          }

          if (itemTotal) {
            itemTotal.textContent = `R$ ${(item.price * newQuantity)
              .toFixed(2)
              .replace(".", ",")}`;
          }
        }
      }
    }
  }

  async removeItem(productId) {
    this.showConfirmModal(
      "Tem certeza que deseja remover este item?",
      async () => {
        try {
          const response = await fetch(
            `${API_CONFIG.BASE_URL}/cart/${this.clientId}/items/${productId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (data.success) {
            this.updateSummary(data.data.totals);
            this.loadCart();
          } else {
            this.showError("Erro ao remover item: " + data.message);
          }
        } catch (error) {
          this.showError("Erro ao remover item: " + error.message);
        }
      }
    );
  }

  async clearCart() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        this.cart = null;
        this.updateCartDisplay();
        this.updateSummary({ subtotal: 0, total: 0, totalQuantity: 0 });
        this.showSuccess("Carrinho limpo com sucesso!");
      } else {
        this.showError("Erro ao limpar carrinho: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao limpar carrinho: " + error.message);
    }
  }

  async renewCart() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}/renew`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Carrinho renovado com sucesso!");
        this.hideExpirationNotification();
      } else {
        this.showError("Erro ao renovar carrinho: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao renovar carrinho: " + error.message);
    }
  }

  proceedToCheckout() {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      this.showError("Carrinho vazio!");
      return;
    }

    // Redirecionar para página de checkout
    window.location.href = `checkout.html?cartId=${this.cart.id}`;
  }

  startExpirationCheck() {
    // Verificar itens que vão expirar a cada 30 segundos
    this.expirationTimer = setInterval(async () => {
      await this.checkExpiringItems();
    }, 30000);

    // Verificar imediatamente
    this.checkExpiringItems();
  }

  async checkExpiringItems() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/expiring-items`
      );
      const data = await response.json();

      if (data.success && data.data.items.length > 0) {
        const item = data.data.items[0];
        if (item.timeLeft <= 5) {
          this.showExpirationNotification(
            `Seu carrinho expirará em ${item.timeLeft} minutos!`
          );
        }
      }
    } catch (error) {
      console.error("Erro ao verificar expiração:", error);
    }
  }

  showExpirationNotification(message) {
    const notification = document.getElementById("expiration-notification");
    const messageElement = document.getElementById("expiration-message");

    messageElement.textContent = message;
    notification.style.display = "flex";
  }

  hideExpirationNotification() {
    const notification = document.getElementById("expiration-notification");
    notification.style.display = "none";
  }

  showConfirmModal(message, callback) {
    const modal = document.getElementById("confirm-modal");
    const messageElement = document.getElementById("confirm-message");

    messageElement.textContent = message;
    modal.style.display = "block";

    this.confirmCallback = callback;
  }

  hideConfirmModal() {
    const modal = document.getElementById("confirm-modal");
    modal.style.display = "none";
    this.confirmCallback = null;
  }

  confirmAction() {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.hideConfirmModal();
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showNotification(message, type = "info") {
    // Criar elemento de notificação
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

    // Adicionar ao body
    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Inicializar quando a página carregar
let cartManager;
document.addEventListener("DOMContentLoaded", () => {
  cartManager = new CartManager();
});
