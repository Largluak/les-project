class OrdersManager {
  constructor() {
    this.clientId = this.getClientId();
    this.currentPage = 1;
    this.currentFilters = {};
    this.orders = [];
    this.currentOrder = null;
    this.init();
  }

  init() {
    this.loadOrders();
    this.setupEventListeners();
  }

  getClientId() {
    return localStorage.getItem("clientId") || "42";
  }

  setupEventListeners() {
    // Filtros
    document
      .getElementById("apply-filters")
      .addEventListener("click", () => this.applyFilters());
    document
      .getElementById("clear-filters")
      .addEventListener("click", () => this.clearFilters());

    // Busca
    document
      .getElementById("search-order")
      .addEventListener("click", () => this.searchOrder());
    document
      .getElementById("order-search")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.searchOrder();
      });

    // Modais
    document
      .getElementById("close-order-modal")
      .addEventListener("click", () => this.hideOrderModal());
    document
      .getElementById("close-modal-btn")
      .addEventListener("click", () => this.hideOrderModal());
    document
      .getElementById("close-exchange-modal")
      .addEventListener("click", () => this.hideExchangeModal());
    document
      .getElementById("cancel-exchange")
      .addEventListener("click", () => this.hideExchangeModal());

    // Troca
    document
      .getElementById("request-exchange-btn")
      .addEventListener("click", () => this.showExchangeModal());
    document
      .getElementById("submit-exchange")
      .addEventListener("click", () => this.submitExchange());
    document
      .getElementById("exchange-reason")
      .addEventListener("change", (e) => {
        const otherGroup = document.getElementById("other-reason-group");
        otherGroup.style.display =
          e.target.value === "Outro" ? "block" : "none";
      });
  }

  async loadOrders() {
    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 10,
        ...this.currentFilters,
      });

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/orders/client/${this.clientId}?${params}`
      );
      const data = await response.json();

      if (data.success) {
        this.orders = data.data.orders;
        this.updateOrdersList();
        this.updatePagination(data.data.pagination);
      } else {
        this.showError("Erro ao carregar pedidos: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao carregar pedidos: " + error.message);
    }
  }

  updateOrdersList() {
    const ordersList = document.getElementById("orders-list");

    if (this.orders.length === 0) {
      ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-list fa-3x"></i>
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Você ainda não possui pedidos ou não há pedidos que correspondam aos filtros aplicados.</p>
                </div>
            `;
      return;
    }

    ordersList.innerHTML = this.orders
      .map(
        (order) => `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Pedido #${order.orderNumber}</h3>
                        <p class="order-date">${this.formatDate(
                          order.createdAt
                        )}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status.toLowerCase()}">
                            ${this.getStatusText(order.status)}
                        </span>
                    </div>
                </div>
                
                <div class="order-items">
                    ${(order.items || [])
                      .slice(0, 3)
                      .map(
                        (item) => `
                        <div class="order-item">
                            <span class="item-name">${item.product.name}</span>
                            <span class="item-quantity">Qtd: ${
                              item.quantity
                            }</span>
                            <span class="item-price">R$ ${(
                              item.price * item.quantity
                            )
                              .toFixed(2)
                              .replace(".", ",")}</span>
                        </div>
                    `
                      )
                      .join("")}
                    ${
                      order.items.length > 3
                        ? `<p class="more-items">+${
                            order.items.length - 3
                          } itens</p>`
                        : ""
                    }
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: R$ ${order.finalAmount
                          .toFixed(2)
                          .replace(".", ",")}</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline btn-sm" onclick="ordersManager.viewOrder(${
                          order.id
                        })">
                            <i class="fas fa-eye"></i> Ver Detalhes
                        </button>
                        ${
                          this.canRequestExchange(order)
                            ? `
                            <button class="btn btn-warning btn-sm" onclick="ordersManager.requestExchange(${order.id})">
                                <i class="fas fa-exchange-alt"></i> Trocar
                            </button>
                        `
                            : ""
                        }
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
                <button class="btn btn-outline" onclick="ordersManager.goToPage(${
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
                        onclick="ordersManager.goToPage(${i})">
                    ${i}
                </button>
            `;
    }

    // Botão próximo
    if (pagination.page < pagination.pages) {
      paginationHTML += `
                <button class="btn btn-outline" onclick="ordersManager.goToPage(${
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
    this.loadOrders();
  }

  applyFilters() {
    this.currentFilters = {
      status: document.getElementById("status-filter").value,
      startDate: document.getElementById("start-date").value,
      endDate: document.getElementById("end-date").value,
    };

    // Remover valores vazios
    Object.keys(this.currentFilters).forEach((key) => {
      if (!this.currentFilters[key]) {
        delete this.currentFilters[key];
      }
    });

    this.currentPage = 1;
    this.loadOrders();
  }

  clearFilters() {
    document.getElementById("status-filter").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
    this.currentFilters = {};
    this.currentPage = 1;
    this.loadOrders();
  }

  async searchOrder() {
    const orderNumber = document.getElementById("order-search").value.trim();

    if (!orderNumber) {
      this.showError("Digite um número de pedido");
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/orders/number/${orderNumber}`
      );
      const data = await response.json();

      if (data.success) {
        this.orders = [data.data.order];
        this.updateOrdersList();
        document.getElementById("pagination").innerHTML = "";
      } else {
        this.showError("Pedido não encontrado: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao buscar pedido: " + error.message);
    }
  }

  async viewOrder(orderId) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        this.currentOrder = data.data.order;
        this.showOrderDetails();
      } else {
        this.showError("Erro ao carregar detalhes do pedido: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao carregar detalhes do pedido: " + error.message);
    }
  }

  showOrderDetails() {
    const order = this.currentOrder;
    const orderDetails = document.getElementById("order-details");

    orderDetails.innerHTML = `
            <div class="order-detail-header">
                <h4>Pedido #${order.orderNumber}</h4>
                <span class="status-badge status-${order.status.toLowerCase()}">
                    ${this.getStatusText(order.status)}
                </span>
            </div>
            
            <div class="order-detail-info">
                <div class="info-section">
                    <h5>Informações do Pedido</h5>
                    <p><strong>Data:</strong> ${this.formatDate(
                      order.createdAt
                    )}</p>
                    <p><strong>Total:</strong> R$ ${order.finalAmount
                      .toFixed(2)
                      .replace(".", ",")}</p>
                    <p><strong>Frete:</strong> R$ ${order.shippingAmount
                      .toFixed(2)
                      .replace(".", ",")}</p>
                    <p><strong>Desconto:</strong> R$ ${order.discountAmount
                      .toFixed(2)
                      .replace(".", ",")}</p>
                </div>
                
                <div class="info-section">
                    <h5>Endereço de Entrega</h5>
                    <div class="address-info">
                        ${this.formatAddress(order.deliveryAddress)}
                    </div>
                </div>
                
                <div class="info-section">
                    <h5>Itens do Pedido</h5>
                    <div class="order-items-detail">
                        ${order.items
                          .map(
                            (item) => `
                            <div class="order-item-detail">
                                <div class="item-info">
                                    <h6>${item.product.name}</h6>
                                    <p>Quantidade: ${item.quantity}</p>
                                    <p>Preço unitário: R$ ${item.price
                                      .toFixed(2)
                                      .replace(".", ",")}</p>
                                </div>
                                <div class="item-total">
                                    R$ ${(item.price * item.quantity)
                                      .toFixed(2)
                                      .replace(".", ",")}
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                
                ${
                  order.payments && order.payments.length > 0
                    ? `
                    <div class="info-section">
                        <h5>Pagamento</h5>
                        <div class="payment-info">
                            ${order.payments
                              .map(
                                (payment) => `
                                <div class="payment-item">
                                    <p><strong>Tipo:</strong> ${
                                      payment.type === "credit_card"
                                        ? "Cartão de Crédito"
                                        : "Cupom"
                                    }</p>
                                    <p><strong>Valor:</strong> R$ ${payment.amount
                                      .toFixed(2)
                                      .replace(".", ",")}</p>
                                    <p><strong>Status:</strong> ${this.getPaymentStatusText(
                                      payment.status
                                    )}</p>
                                    ${
                                      payment.card && payment.card.cardNumber
                                        ? `<p><strong>Cartão:</strong> **** **** **** ${payment.card.cardNumber.slice(
                                            -4
                                          )}</p>`
                                        : ""
                                    }
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : ""
                }
            </div>
        `;

    // Mostrar/ocultar botão de troca
    const exchangeBtn = document.getElementById("request-exchange-btn");
    exchangeBtn.style.display = this.canRequestExchange(order)
      ? "block"
      : "none";

    document.getElementById("order-modal").style.display = "block";
  }

  hideOrderModal() {
    document.getElementById("order-modal").style.display = "none";
    this.currentOrder = null;
  }

  showExchangeModal() {
    if (!this.currentOrder) return;

    // Preencher produtos disponíveis para troca
    const productSelect = document.getElementById("exchange-product");
    productSelect.innerHTML = '<option value="">Selecione um produto</option>';

    this.currentOrder.items.forEach((item) => {
      productSelect.innerHTML += `
                <option value="${item.productId}" data-max-quantity="${item.quantity}">
                    ${item.product.name} (Máx: ${item.quantity})
                </option>
            `;
    });

    // Atualizar quantidade máxima quando produto for selecionado
    productSelect.addEventListener("change", (e) => {
      const selectedOption = e.target.selectedOptions[0];
      if (selectedOption) {
        const maxQuantity = selectedOption.dataset.maxQuantity;
        document.getElementById("exchange-quantity").max = maxQuantity;
      }
    });

    document.getElementById("exchange-order-id").value = this.currentOrder.id;
    document.getElementById("exchange-modal").style.display = "block";
  }

  hideExchangeModal() {
    document.getElementById("exchange-modal").style.display = "none";
    document.getElementById("exchange-form").reset();
  }

  async submitExchange() {
    const orderId = document.getElementById("exchange-order-id").value;
    const productId = document.getElementById("exchange-product").value;
    const quantity = parseInt(
      document.getElementById("exchange-quantity").value
    );
    const reason = document.getElementById("exchange-reason").value;
    const otherReason = document.getElementById("other-reason").value;

    if (!productId || !quantity || !reason) {
      this.showError("Preencha todos os campos obrigatórios");
      return;
    }

    if (reason === "Outro" && !otherReason.trim()) {
      this.showError("Especifique o motivo da troca");
      return;
    }

    const exchangeData = {
      productId: parseInt(productId),
      quantity: quantity,
      reason: reason === "Outro" ? otherReason : reason,
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/orders/${orderId}/exchange`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(exchangeData),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.showSuccess("Solicitação de troca enviada com sucesso!");
        this.hideExchangeModal();
        this.hideOrderModal();
        this.loadOrders(); // Recarregar lista
      } else {
        this.showError("Erro ao solicitar troca: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao solicitar troca: " + error.message);
    }
  }

  canRequestExchange(order) {
    return order.status === "DELIVERED";
  }

  getStatusText(status) {
    const statusMap = {
      OPEN: "Em Aberto",
      PROCESSING: "Processando",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
      IN_TRANSIT: "Em Trânsito",
      DELIVERED: "Entregue",
      EXCHANGE_REQUESTED: "Solicitação de Troca",
      EXCHANGE_AUTHORIZED: "Troca Autorizada",
      EXCHANGED: "Trocado",
    };
    return statusMap[status] || status;
  }

  getPaymentStatusText(status) {
    const statusMap = {
      PENDING: "Pendente",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
    };
    return statusMap[status] || status;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  formatAddress(address) {
    if (typeof address === "string") {
      address = JSON.parse(address);
    }

    return `
            <p><strong>${address.name}</strong></p>
            <p>${address.street}</p>
            <p>${address.district} - ${address.city}/${address.state}</p>
            <p>CEP: ${address.cep}</p>
            ${
              address.observations
                ? `<p><small>${address.observations}</small></p>`
                : ""
            }
        `;
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
let ordersManager;
document.addEventListener("DOMContentLoaded", () => {
  ordersManager = new OrdersManager();
});
