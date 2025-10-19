class CheckoutManager {
  constructor() {
    this.clientId = this.getClientId();
    this.currentStep = 1;
    this.cart = null;
    this.order = null;
    this.selectedAddress = null;
    this.selectedCard = null;
    this.appliedCoupons = [];
    this.paymentType = "single"; // "single" ou "multiple"
    this.multipleCards = []; // Array de cartões para pagamento múltiplo
    this.init();
  }

  init() {
    this.loadCart();
    this.setupEventListeners();
    this.setupMasks();
  }

  getClientId() {
    // Buscar clientId do localStorage ou usar um padrão
    // Em produção, isso viria de um sistema de autenticação
    const clientId = localStorage.getItem("clientId") || "42";

    // Se não há clientId no localStorage, tentar obter da URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlClientId = urlParams.get("clientId");

    return urlClientId || clientId;
  }

  setupEventListeners() {
    // Navegação entre passos
    document
      .getElementById("next-step-1")
      .addEventListener("click", () => this.nextStep());
    document
      .getElementById("prev-step-2")
      .addEventListener("click", () => this.prevStep());
    document
      .getElementById("next-step-2")
      .addEventListener("click", () => this.nextStep());
    document
      .getElementById("prev-step-3")
      .addEventListener("click", () => this.prevStep());
    document
      .getElementById("confirm-order")
      .addEventListener("click", () => this.confirmOrder());

    // Endereços
    document
      .getElementById("add-address-btn")
      .addEventListener("click", () => this.showAddressModal());
    document
      .getElementById("cancel-address")
      .addEventListener("click", () => this.hideAddressModal());
    document
      .getElementById("address-form")
      .addEventListener("submit", (e) => this.saveAddress(e));

    // Cartões
    document
      .getElementById("add-card-btn")
      .addEventListener("click", () => this.showCardModal());
    document
      .getElementById("cancel-card")
      .addEventListener("click", () => this.hideCardModal());
    document
      .getElementById("card-form")
      .addEventListener("submit", (e) => this.saveCard(e));

    // Cupons
    document
      .getElementById("apply-coupon")
      .addEventListener("click", () => this.applyCoupon());

    // Múltiplos cartões (RN0034)
    document.querySelectorAll('input[name="payment-type"]').forEach((radio) => {
      radio.addEventListener("change", (e) => this.handlePaymentTypeChange(e));
    });

    document
      .getElementById("add-multiple-card-btn")
      .addEventListener("click", () => this.addMultipleCard());

    document
      .getElementById("distribute-amount-btn")
      .addEventListener("click", () => this.distributeAmount());
  }

  async loadCart() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/cart/${this.clientId}`
      );
      const data = await response.json();

      if (response.ok) {
        this.cart = data.data.cart;
        this.updateSidebar();
        this.loadAddresses();
        this.loadCards();
      } else {
        this.showError(
          "Erro ao carregar carrinho: " + (data.message || "Erro desconhecido")
        );
      }
    } catch (error) {
      this.showError("Erro ao carregar carrinho: " + error.message);
    }
  }

  updateSidebar() {
    if (!this.cart || !this.cart.items) return;

    // Função auxiliar para atualizar itens em qualquer container
    const updateItemsContainer = (containerId) => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = this.cart.items
          .map(
            (item) => `
                <div class="sidebar-item">
                    <div class="item-info">
                        <span class="item-name">${item.product.name}</span>
                        <span class="item-quantity">Qtd: ${item.quantity}</span>
                    </div>
                    <div class="item-price">R$ ${(item.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}</div>
                </div>
            `
          )
          .join("");
      }
    };

    // Atualizar tanto sidebar quanto resumo abaixo
    updateItemsContainer("sidebar-items");
    updateItemsContainer("summary-items");

    // Atualizar totais
    const totals = this.calculateTotals();

    // Função auxiliar para atualizar totais
    const updateTotal = (id, value) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    };

    // Sidebar (se existir)
    updateTotal(
      "sidebar-subtotal",
      `R$ ${totals.subtotal.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "sidebar-shipping",
      `R$ ${totals.shipping.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "sidebar-discount",
      `- R$ ${totals.discount.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "sidebar-total",
      `R$ ${totals.total.toFixed(2).replace(".", ",")}`
    );

    // Resumo abaixo
    updateTotal(
      "summary-subtotal",
      `R$ ${totals.subtotal.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "summary-shipping",
      `R$ ${totals.shipping.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "summary-discount",
      `- R$ ${totals.discount.toFixed(2).replace(".", ",")}`
    );
    updateTotal(
      "summary-total",
      `R$ ${totals.total.toFixed(2).replace(".", ",")}`
    );
  }

  calculateTotals() {
    if (!this.cart || !this.cart.items) {
      console.log("Carrinho ou itens não encontrados");
      return { subtotal: 0, shipping: 0, discount: 0, total: 0 };
    }

    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = this.calculateShipping();
    const discount = this.appliedCoupons.reduce(
      (sum, coupon) => sum + coupon.value,
      0
    );

    const total = this.roundToTwoDecimals(subtotal + shipping - discount);

    console.log("Calculando totais:", {
      subtotal,
      shipping,
      discount,
      total,
      items: this.cart.items,
    });

    return { subtotal, shipping, discount, total };
  }

  // Método auxiliar para arredondar valores para 2 casas decimais
  roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }

  calculateShipping() {
    // Simulação de cálculo de frete
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

  async loadAddresses() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/addresses`
      );
      const data = await response.json();

      if (response.ok) {
        this.updateAddressList(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    }
  }

  updateAddressList(addresses) {
    const addressList = document.getElementById("address-list");

    if (addresses.length === 0) {
      addressList.innerHTML = "<p>Nenhum endereço cadastrado</p>";
      return;
    }

    addressList.innerHTML = addresses
      .map(
        (address) => `
            <div class="address-card" data-address-id="${address.id}" 
                 onclick="checkoutManager.selectAddress(${address.id})">
                <div class="address-info">
                    <h4>${address.name}</h4>
                    <p>${address.streetType} ${address.street}, ${
          address.number
        }</p>
                    <p>${address.district} - ${address.city}/${
          address.state
        }</p>
                    <p>CEP: ${address.cep}</p>
                    ${
                      address.observations
                        ? `<p><small>${address.observations}</small></p>`
                        : ""
                    }
                </div>
                <div class="address-selection-indicator">
                    <i class="fas fa-circle"></i>
                </div>
            </div>
        `
      )
      .join("");
  }

  selectAddress(addressId) {
    // Remover seleção anterior
    document.querySelectorAll(".address-card").forEach((card) => {
      card.classList.remove("selected");
    });

    // Adicionar seleção ao card clicado
    const selectedCard = document.querySelector(
      `[data-address-id="${addressId}"]`
    );
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }

    this.selectedAddress = addressId;
    document.getElementById("next-step-1").disabled = false;
  }

  async loadCards() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/cards`
      );
      const data = await response.json();

      if (response.ok) {
        this.updateCardList(data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
    }
  }

  updateCardList(cards) {
    const cardList = document.getElementById("card-list");

    if (cards.length === 0) {
      cardList.innerHTML = "<p>Nenhum cartão cadastrado</p>";
      return;
    }

    cardList.innerHTML = cards
      .map(
        (card) => `
            <div class="card-item" data-card-id="${card.id}" 
                 onclick="checkoutManager.selectCard(${card.id})">
                <div class="card-info">
                    <h4>${card.cardName}</h4>
                    <p>**** **** **** ${
                      card.cardNumber ? card.cardNumber.slice(-4) : "****"
                    }</p>
                    <p>${card.brand}</p>
                    ${
                      card.isPreferred
                        ? '<span class="badge">Preferencial</span>'
                        : ""
                    }
                </div>
                <div class="card-selection-indicator">
                    <i class="fas fa-circle"></i>
                </div>
            </div>
        `
      )
      .join("");
  }

  selectCard(cardId) {
    // Remover seleção anterior
    document.querySelectorAll(".card-item").forEach((card) => {
      card.classList.remove("selected");
    });

    // Adicionar seleção ao card clicado
    const selectedCard = document.querySelector(`[data-card-id="${cardId}"]`);
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }

    this.selectedCard = cardId;
    this.updateStep2Validation();
  }

  updateStep2Validation() {
    const nextButton = document.getElementById("next-step-2");

    // ✅ Lógica corrigida: habilitar se há cartão selecionado OU múltiplos cartões OU cupons
    const hasSingleCard = this.selectedCard !== null;
    const hasMultipleCards =
      this.paymentType === "multiple" && this.multipleCards.length > 0;
    const hasCoupons = this.appliedCoupons.length > 0;

    nextButton.disabled = !hasSingleCard && !hasMultipleCards && !hasCoupons;

    console.log("Validação do passo 2:", {
      hasSingleCard,
      hasMultipleCards,
      hasCoupons,
      paymentType: this.paymentType,
      multipleCardsCount: this.multipleCards.length,
      buttonDisabled: nextButton.disabled,
    });
  }

  showAddressModal() {
    document.getElementById("address-modal").style.display = "block";
  }

  hideAddressModal() {
    document.getElementById("address-modal").style.display = "none";
    document.getElementById("address-form").reset();
  }

  async saveAddress(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const addressData = {
      name: document.getElementById("address-name").value,
      residenceType: document.getElementById("residence-type").value,
      streetType: document.getElementById("street-type").value,
      street: document.getElementById("street").value,
      number: document.getElementById("number").value,
      district: document.getElementById("district").value,
      cep: document.getElementById("cep").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
      observations: document.getElementById("observations").value,
      isDelivery: true,
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/addresses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        this.showSuccess("Endereço adicionado com sucesso!");
        this.hideAddressModal();
        this.loadAddresses();
      } else {
        this.showError(
          "Erro ao adicionar endereço: " + (data.message || "Erro desconhecido")
        );
      }
    } catch (error) {
      this.showError("Erro ao adicionar endereço: " + error.message);
    }
  }

  showCardModal() {
    document.getElementById("card-modal").style.display = "block";
  }

  hideCardModal() {
    document.getElementById("card-modal").style.display = "none";
    document.getElementById("card-form").reset();
  }

  async saveCard(e) {
    e.preventDefault();

    const cardData = {
      cardName: document.getElementById("card-name").value,
      cardNumber: document
        .getElementById("card-number")
        .value.replace(/\s/g, ""), // Remove espaços
      brand: document.getElementById("card-brand").value,
      securityCode: document.getElementById("security-code").value,
      isPreferred: document.getElementById("is-preferred").checked,
    };

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/cards`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cardData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        this.showSuccess("Cartão adicionado com sucesso!");
        this.hideCardModal();
        this.loadCards();
      } else {
        this.showError(
          "Erro ao adicionar cartão: " + (data.message || "Erro desconhecido")
        );
      }
    } catch (error) {
      this.showError("Erro ao adicionar cartão: " + error.message);
    }
  }

  async applyCoupon() {
    const couponCode = document.getElementById("coupon-code").value.trim();

    if (!couponCode) {
      this.showError("Digite um código de cupom");
      return;
    }

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/coupons/validate/${couponCode}?clientId=${
          this.clientId
        }&orderAmount=${this.calculateTotals().subtotal}`
      );
      const data = await response.json();

      if (response.ok) {
        const coupon = data.data.coupon;

        // Verificar se cupom já foi aplicado
        if (this.appliedCoupons.find((c) => c.id === coupon.id)) {
          this.showError("Cupom já foi aplicado");
          return;
        }

        this.appliedCoupons.push(coupon);
        this.updateAppliedCoupons();
        this.updateSidebar();
        this.updateStep2Validation();

        document.getElementById("coupon-code").value = "";
        this.showSuccess("Cupom aplicado com sucesso!");
      } else {
        this.showError("Cupom inválido: " + data.message);
      }
    } catch (error) {
      this.showError("Erro ao aplicar cupom: " + error.message);
    }
  }

  updateAppliedCoupons() {
    const container = document.getElementById("applied-coupons");

    if (this.appliedCoupons.length === 0) {
      container.innerHTML = "";
      return;
    }

    container.innerHTML = this.appliedCoupons
      .map(
        (coupon) => `
            <div class="applied-coupon">
                <span>${coupon.code} - R$ ${coupon.value
          .toFixed(2)
          .replace(".", ",")}</span>
                <button onclick="checkoutManager.removeCoupon('${
                  coupon.code
                }')" class="btn btn-sm btn-danger">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `
      )
      .join("");
  }

  removeCoupon(couponCode) {
    this.appliedCoupons = this.appliedCoupons.filter(
      (c) => c.code !== couponCode
    );
    this.updateAppliedCoupons();
    this.updateSidebar();
    this.updateStep2Validation();
  }

  nextStep() {
    if (this.currentStep < 3) {
      document
        .getElementById(`step-${this.currentStep}`)
        .classList.remove("active");
      document
        .querySelector(`[data-step="${this.currentStep}"]`)
        .classList.remove("active");

      this.currentStep++;

      document
        .getElementById(`step-${this.currentStep}`)
        .classList.add("active");
      document
        .querySelector(`[data-step="${this.currentStep}"]`)
        .classList.add("active");

      if (this.currentStep === 3) {
        this.updateOrderSummary();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      document
        .getElementById(`step-${this.currentStep}`)
        .classList.remove("active");
      document
        .querySelector(`[data-step="${this.currentStep}"]`)
        .classList.remove("active");

      this.currentStep--;

      document
        .getElementById(`step-${this.currentStep}`)
        .classList.add("active");
      document
        .querySelector(`[data-step="${this.currentStep}"]`)
        .classList.add("active");
    }
  }

  updateOrderSummary() {
    if (!this.cart || !this.cart.items) return;

    const orderItems = document.getElementById("order-items");
    orderItems.innerHTML = this.cart.items
      .map(
        (item) => `
            <div class="order-item">
                <div class="item-info">
                    <h4>${item.product.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <div class="item-price">R$ ${(item.price * item.quantity)
                  .toFixed(2)
                  .replace(".", ",")}</div>
            </div>
        `
      )
      .join("");

    const totals = this.calculateTotals();
    document.getElementById(
      "order-subtotal"
    ).textContent = `R$ ${totals.subtotal.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "order-shipping"
    ).textContent = `R$ ${totals.shipping.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "order-discount"
    ).textContent = `- R$ ${totals.discount.toFixed(2).replace(".", ",")}`;
    document.getElementById("order-total").textContent = `R$ ${totals.total
      .toFixed(2)
      .replace(".", ",")}`;
  }

  async confirmOrder() {
    if (!this.selectedAddress) {
      this.showError("Selecione um endereço de entrega");
      return;
    }

    // Validar forma de pagamento baseada no tipo selecionado
    if (this.paymentType === "single") {
      if (!this.selectedCard && this.appliedCoupons.length === 0) {
        this.showError("Selecione uma forma de pagamento");
        return;
      }
    } else if (this.paymentType === "multiple") {
      const validation = this.validateMultipleCards();
      if (!validation.valid) {
        this.showError(validation.message);
        return;
      }
    }

    try {
      // Criar pedido
      const orderResponse = await fetch(
        `${API_CONFIG.BASE_URL}/orders/${this.clientId}/create-from-cart`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deliveryAddressId: this.selectedAddress,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        this.showError("Erro ao criar pedido: " + orderData.message);
        return;
      }

      this.order = orderData.data.order;

      // Processar pagamento
      const paymentData = {
        cardId: this.paymentType === "single" ? this.selectedCard : null,
        cards:
          this.paymentType === "multiple"
            ? this.multipleCards.map((card) => ({
                cardId: card.cardId,
                amount: card.amount,
              }))
            : [],
        couponCodes: this.appliedCoupons.map((c) => c.code),
      };

      console.log("=== DADOS DE PAGAMENTO ENVIADOS ===");
      console.log("Tipo de pagamento:", this.paymentType);
      console.log("Dados do pagamento:", JSON.stringify(paymentData, null, 2));
      console.log("Cartões múltiplos:", this.multipleCards);
      console.log("Total do carrinho:", this.calculateTotals().total);

      const paymentResponse = await fetch(
        `${API_CONFIG.BASE_URL}/orders/${this.order.id}/payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        this.showSuccess("Pedido confirmado com sucesso!");
        setTimeout(() => {
          window.location.href = `pedidos.html?orderId=${this.order.id}`;
        }, 2000);
      } else {
        this.showError("Erro no pagamento: " + paymentResult.message);
      }
    } catch (error) {
      this.showError("Erro ao confirmar pedido: " + error.message);
    }
  }

  showSuccess(message) {
    this.showNotification(message, "success");
  }

  showError(message) {
    this.showNotification(message, "error");
  }

  showInfo(message) {
    this.showNotification(message, "info");
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

  setupMasks() {
    // Máscara para número do cartão
    this.setupCardNumberMask();

    // Máscara para CEP
    this.setupCepMask();

    // Máscara para código de segurança
    this.setupSecurityCodeMask();

    // Máscara para telefone (se existir)
    this.setupPhoneMask();
  }

  setupCardNumberMask() {
    const cardNumberInput = document.getElementById("card-number");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        // Limitar a 16 dígitos (máximo para cartões)
        if (value.length > 16) {
          value = value.substring(0, 16);
        }
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        e.target.value = value;
      });
    }
  }

  setupCepMask() {
    const cepInput = document.getElementById("cep");
    if (cepInput) {
      cepInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        // Limitar a 8 dígitos (CEP brasileiro)
        if (value.length > 8) {
          value = value.substring(0, 8);
        }
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = value;
      });
    }
  }

  setupSecurityCodeMask() {
    const securityCodeInput = document.getElementById("security-code");
    if (securityCodeInput) {
      securityCodeInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        // Limitar a 4 dígitos (código de segurança)
        if (value.length > 4) {
          value = value.substring(0, 4);
        }
        e.target.value = value;
      });
    }
  }

  setupPhoneMask() {
    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        // Limitar a 11 dígitos (telefone brasileiro)
        if (value.length > 11) {
          value = value.substring(0, 11);
        }
        if (value.length <= 10) {
          value = value.replace(/(\d{2})(\d)/, "($1) $2");
          value = value.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
          value = value.replace(/(\d{2})(\d)/, "($1) $2");
          value = value.replace(/(\d{5})(\d)/, "$1-$2");
        }
        e.target.value = value;
      });
    }
  }

  // Métodos para múltiplos cartões (RN0034)
  handlePaymentTypeChange(e) {
    this.paymentType = e.target.value;

    const singleSection = document.getElementById("single-card-section");
    const multipleSection = document.getElementById("multiple-cards-section");

    if (this.paymentType === "single") {
      singleSection.style.display = "block";
      multipleSection.style.display = "none";
      this.multipleCards = [];
    } else {
      singleSection.style.display = "none";
      multipleSection.style.display = "block";
      this.selectedCard = null;

      // Carregar cartões automaticamente quando selecionar múltiplos cartões
      this.loadCardsForMultiplePayment();
    }

    this.updateOrderSummary();
    this.updateStep2Validation(); // ✅ Atualizar validação quando tipo de pagamento muda
  }

  async loadCardsForMultiplePayment() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/cards`
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        // Limpar cartões existentes
        this.multipleCards = [];

        // Adicionar todos os cartões disponíveis automaticamente
        data.data.forEach((card) => {
          const cardData = {
            cardId: card.id,
            cardName: card.cardName,
            cardNumber: card.cardNumber,
            brand: card.brand,
            amount: 0.0, // Valor será definido pelo usuário
          };
          this.multipleCards.push(cardData);
        });

        // Renderizar os cartões
        this.renderMultipleCards();
        this.updatePaymentSummary();

        // Distribuir valor automaticamente se houver cartões
        if (this.multipleCards.length > 0) {
          this.distributeAmount();
        }

        // Atualizar validação do botão continuar
        this.updateStep2Validation();

        // Mostrar mensagem informativa
        this.showInfo(
          "Cartões carregados automaticamente. Valores distribuídos automaticamente."
        );
      } else {
        this.showError(
          "Nenhum cartão encontrado. Adicione um cartão primeiro."
        );
      }
    } catch (error) {
      this.showError("Erro ao carregar cartões: " + error.message);
    }
  }

  async addMultipleCard() {
    try {
      console.log("Adicionando cartão múltiplo...");

      // Carregar cartões disponíveis
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/clients/${this.clientId}/cards`
      );
      const data = await response.json();

      console.log("Resposta da API:", data);

      if (!data.success) {
        this.showError("Erro ao carregar cartões");
        return;
      }

      const availableCards = data.data.filter(
        (card) => !this.multipleCards.some((mc) => mc.cardId === card.id)
      );

      console.log("Cartões disponíveis:", availableCards);

      if (availableCards.length === 0) {
        this.showError("Todos os cartões já foram adicionados");
        return;
      }

      // Criar modal de seleção de cartão
      this.showCardSelectionModal(availableCards);
    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      this.showError("Erro ao carregar cartões: " + error.message);
    }
  }

  showCardSelectionModal(cards) {
    console.log("Criando modal de seleção de cartão...");
    console.log("Cartões para seleção:", cards);

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "block";
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Selecionar Cartão</h3>
        <div class="card-selection">
          ${cards
            .map(
              (card) => `
            <div class="card-option" data-card-id="${card.id}">
              <div class="card-info">
                <div class="card-name">${card.cardName}</div>
                <div class="card-number">**** **** **** ${
                  card.cardNumber ? card.cardNumber.slice(-4) : "****"
                }</div>
                <div class="card-brand">${card.brand}</div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
            Cancelar
          </button>
        </div>
      </div>
    `;

    console.log("Modal criado:", modal);
    document.body.appendChild(modal);
    console.log("Modal adicionado ao DOM");

    // Adicionar event listeners para seleção
    modal.querySelectorAll(".card-option").forEach((option) => {
      option.addEventListener("click", () => {
        const cardId = parseInt(option.dataset.cardId);
        const card = cards.find((c) => c.id === cardId);
        this.addCardToMultiple(card);
        modal.remove();
      });
    });
  }

  addCardToMultiple(card) {
    const cardData = {
      cardId: card.id,
      cardName: card.cardName,
      cardNumber: card.cardNumber,
      brand: card.brand,
      amount: 0.0,
    };

    this.multipleCards.push(cardData);
    this.renderMultipleCards();
    this.updatePaymentSummary();
    this.updateStep2Validation(); // ✅ Atualizar validação quando cartão é adicionado
  }

  renderMultipleCards() {
    const container = document.getElementById("multiple-cards-list");
    container.innerHTML = "";

    this.multipleCards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.className = "multiple-card-item";
      cardElement.innerHTML = `
        <div class="card-info">
          <div class="card-name">${card.cardName}</div>
          <div class="card-number">**** **** **** ${
            card.cardNumber ? card.cardNumber.slice(-4) : "****"
          } - ${card.brand}</div>
        </div>
        <div class="amount-input">
          <label>Valor:</label>
          <input type="number" 
                 step="0.01" 
                 min="10" 
                 max="${this.cart ? this.calculateTotals().total : 0}" 
                 value="${parseFloat(card.amount) || 0}"
                 data-index="${index}"
                 placeholder="0,00">
        </div>
        <button type="button" class="remove-card" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      `;

      container.appendChild(cardElement);
    });

    // Adicionar event listeners
    container.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener("input", (e) => this.updateCardAmount(e));
    });

    container.querySelectorAll(".remove-card").forEach((button) => {
      button.addEventListener("click", (e) => this.removeMultipleCard(e));
    });
  }

  updateCardAmount(e) {
    const index = parseInt(e.target.dataset.index);
    const amount = parseFloat(e.target.value) || 0;

    // Arredondar para 2 casas decimais
    this.multipleCards[index].amount = this.roundToTwoDecimals(amount);

    // Atualizar o input com o valor arredondado
    e.target.value = this.multipleCards[index].amount.toFixed(2);

    this.updatePaymentSummary();
  }

  removeMultipleCard(e) {
    const index = parseInt(e.target.dataset.index);
    this.multipleCards.splice(index, 1);
    this.renderMultipleCards();
    this.updatePaymentSummary();
    this.updateStep2Validation(); // ✅ Atualizar validação quando cartão é removido
  }

  updatePaymentSummary() {
    const summaryContainer = document.getElementById("payment-summary");
    const totalAmount = this.roundToTwoDecimals(
      this.multipleCards.reduce(
        (sum, card) => sum + (parseFloat(card.amount) || 0),
        0
      )
    );
    const orderTotal = this.cart ? this.calculateTotals().total : 0;

    let summaryHTML = `
      <h5>Resumo do Pagamento</h5>
      <div class="summary-item">
        <span>Total do pedido:</span>
        <span>R$ ${orderTotal.toFixed(2).replace(".", ",")}</span>
      </div>
      <div class="summary-item">
        <span>Total dos cartões:</span>
        <span>R$ ${totalAmount.toFixed(2).replace(".", ",")}</span>
      </div>
      <div class="summary-total">
        <span>Diferença:</span>
        <span>R$ ${(orderTotal - totalAmount)
          .toFixed(2)
          .replace(".", ",")}</span>
      </div>
    `;

    // Validações
    const errors = [];

    if (this.multipleCards.length === 0) {
      errors.push("Adicione pelo menos um cartão");
    }

    this.multipleCards.forEach((card, index) => {
      if (card.amount < 10) {
        errors.push(`Cartão ${index + 1}: Valor mínimo é R$ 10,00`);
      }
    });

    if (Math.abs(orderTotal - totalAmount) > 0.01) {
      errors.push("O total dos cartões deve ser igual ao valor do pedido");
    }

    if (errors.length > 0) {
      summaryHTML += `
        <div class="summary-error">
          <i class="fas fa-exclamation-triangle"></i>
          ${errors.join("<br>")}
        </div>
      `;
    } else {
      summaryHTML += `
        <div style="color: #4caf50; margin-top: 10px;">
          <i class="fas fa-check-circle"></i>
          Pagamento válido
        </div>
      `;
    }

    summaryContainer.innerHTML = summaryHTML;
  }

  validateMultipleCards() {
    const totalAmount = this.multipleCards.reduce(
      (sum, card) => sum + card.amount,
      0
    );
    const orderTotal = this.cart ? this.cart.total : 0;

    if (this.multipleCards.length === 0) {
      return { valid: false, message: "Adicione pelo menos um cartão" };
    }

    for (const card of this.multipleCards) {
      if (card.amount < 10) {
        return { valid: false, message: "Valor mínimo por cartão é R$ 10,00" };
      }
    }

    if (Math.abs(orderTotal - totalAmount) > 0.01) {
      return {
        valid: false,
        message: "O total dos cartões deve ser igual ao valor do pedido",
      };
    }

    return { valid: true };
  }

  distributeAmount() {
    console.log("Distribuindo valores...");
    console.log("Cartões múltiplos:", this.multipleCards);
    console.log("Carrinho:", this.cart);

    if (this.multipleCards.length === 0) {
      this.showError("Nenhum cartão adicionado");
      return;
    }

    const orderTotal = this.cart ? this.calculateTotals().total : 0;
    console.log("Total do pedido:", orderTotal);
    const minAmount = 10.0; // R$ 10,00 mínimo por cartão

    if (orderTotal < minAmount * this.multipleCards.length) {
      this.showError(
        `Valor total (R$ ${orderTotal.toFixed(
          2
        )}) é insuficiente para dividir entre ${
          this.multipleCards.length
        } cartões (mínimo R$ ${minAmount.toFixed(2)} por cartão)`
      );
      return;
    }

    // Distribuir valor igualmente entre os cartões
    const baseAmount =
      Math.floor((orderTotal / this.multipleCards.length) * 100) / 100; // Arredondar para 2 casas decimais
    const remainder = orderTotal - baseAmount * this.multipleCards.length;

    this.multipleCards.forEach((card, index) => {
      // Adicionar o resto ao primeiro cartão e arredondar para 2 casas decimais
      const cardAmount = baseAmount + (index === 0 ? remainder : 0);
      card.amount = this.roundToTwoDecimals(cardAmount);
    });

    // Renderizar novamente com os novos valores
    this.renderMultipleCards();
    this.updatePaymentSummary();

    this.showInfo("Valor distribuído automaticamente entre os cartões");
  }
}

// Inicializar quando a página carregar
let checkoutManager;
document.addEventListener("DOMContentLoaded", () => {
  checkoutManager = new CheckoutManager();
});
