// Interceptadores de API para testes
const testData = require("../fixtures/testData.json");

// Interceptar requisições de produtos
Cypress.Commands.add("interceptProductsApi", () => {
  cy.intercept("GET", "/api/products*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        products: testData.products,
        pagination: {
          page: 1,
          pages: 1,
          limit: 12,
          total: testData.products.length,
        },
      },
    },
  }).as("getProducts");
});

// Interceptar requisições de carrinho
Cypress.Commands.add("interceptCartApi", () => {
  cy.intercept("GET", "/api/cart/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        cart: {
          id: 1,
          clientId: 1,
          items: [
            {
              id: 1,
              productId: 1,
              quantity: 1,
              price: 32.9,
              product: testData.products[0],
            },
          ],
        },
        totals: {
          subtotal: 32.9,
          shipping: 15.0,
          discount: 0.0,
          total: 47.9,
          totalQuantity: 1,
        },
      },
    },
  }).as("getCart");

  cy.intercept("POST", "/api/cart/*/items", {
    statusCode: 200,
    body: {
      success: true,
      message: "Produto adicionado ao carrinho com sucesso!",
    },
  }).as("addToCart");

  cy.intercept("PUT", "/api/cart/*/items", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        totals: {
          subtotal: 65.8,
          shipping: 15.0,
          discount: 0.0,
          total: 80.8,
          totalQuantity: 2,
        },
      },
    },
  }).as("updateCartItem");

  cy.intercept("DELETE", "/api/cart/*/items/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        totals: {
          subtotal: 0.0,
          shipping: 0.0,
          discount: 0.0,
          total: 0.0,
          totalQuantity: 0,
        },
      },
    },
  }).as("removeFromCart");

  cy.intercept("DELETE", "/api/cart/*", {
    statusCode: 200,
    body: {
      success: true,
      message: "Carrinho limpo com sucesso!",
    },
  }).as("clearCart");
});

// Interceptar requisições de clientes
Cypress.Commands.add("interceptClientsApi", () => {
  cy.intercept("GET", "/api/clients/*/addresses", {
    statusCode: 200,
    body: {
      success: true,
      data: testData.addresses,
    },
  }).as("getAddresses");

  cy.intercept("POST", "/api/clients/*/addresses", {
    statusCode: 200,
    body: {
      success: true,
      message: "Endereço adicionado com sucesso!",
      data: {
        id: 3,
        ...testData.addresses[0],
      },
    },
  }).as("addAddress");

  cy.intercept("GET", "/api/clients/*/cards", {
    statusCode: 200,
    body: {
      success: true,
      data: testData.cards,
    },
  }).as("getCards");

  cy.intercept("POST", "/api/clients/*/cards", {
    statusCode: 200,
    body: {
      success: true,
      message: "Cartão adicionado com sucesso!",
      data: {
        id: 3,
        ...testData.cards[0],
      },
    },
  }).as("addCard");
});

// Interceptar requisições de cupons
Cypress.Commands.add("interceptCouponsApi", () => {
  cy.intercept("GET", "/api/coupons/validate/*", (req) => {
    const couponCode = req.url.split("/").pop().split("?")[0];
    const validCoupon = testData.coupons.find((c) => c.code === couponCode);

    if (validCoupon && !validCoupon.used) {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            coupon: validCoupon,
          },
        },
      });
    } else {
      req.reply({
        statusCode: 400,
        body: {
          success: false,
          message: "Cupom inválido ou já utilizado",
        },
      });
    }
  }).as("validateCoupon");
});

// Interceptar requisições de pedidos
Cypress.Commands.add("interceptOrdersApi", () => {
  cy.intercept("GET", "/api/orders/client/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        orders: testData.orders,
        pagination: {
          page: 1,
          pages: 1,
          limit: 10,
          total: testData.orders.length,
        },
      },
    },
  }).as("getOrders");

  cy.intercept("GET", "/api/orders/*", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        order: {
          ...testData.orders[0],
          items: [
            {
              id: 1,
              productId: 1,
              quantity: 1,
              price: 32.9,
              product: testData.products[0],
            },
          ],
          payments: [
            {
              id: 1,
              type: "credit_card",
              amount: 47.9,
              status: "APPROVED",
              card: testData.cards[0],
            },
          ],
        },
      },
    },
  }).as("getOrder");

  cy.intercept("POST", "/api/orders/*/create-from-cart", {
    statusCode: 200,
    body: {
      success: true,
      data: {
        order: {
          id: 2,
          orderNumber: "PED002",
          clientId: 1,
          status: "OPEN",
          totalAmount: 47.9,
          shippingAmount: 15.0,
          discountAmount: 0.0,
          finalAmount: 47.9,
        },
      },
    },
  }).as("createOrder");

  cy.intercept("POST", "/api/orders/*/payment", {
    statusCode: 200,
    body: {
      success: true,
      message: "Pagamento processado com sucesso!",
    },
  }).as("processPayment");

  cy.intercept("POST", "/api/orders/*/exchange", {
    statusCode: 200,
    body: {
      success: true,
      message: "Solicitação de troca enviada com sucesso!",
    },
  }).as("requestExchange");
});

// Interceptar todas as APIs
Cypress.Commands.add("interceptAllApis", () => {
  cy.interceptProductsApi();
  cy.interceptCartApi();
  cy.interceptClientsApi();
  cy.interceptCouponsApi();
  cy.interceptOrdersApi();
});

// Interceptar APIs com falha para testes de erro
Cypress.Commands.add("interceptApiErrors", () => {
  cy.intercept("GET", "/api/products*", {
    statusCode: 500,
    body: {
      success: false,
      message: "Erro interno do servidor",
    },
  }).as("getProductsError");

  cy.intercept("POST", "/api/cart/*/items", {
    statusCode: 400,
    body: {
      success: false,
      message: "Produto não disponível em estoque",
    },
  }).as("addToCartError");
});

// Interceptar APIs com delay para testes de timeout
Cypress.Commands.add("interceptApiDelays", (delay = 5000) => {
  cy.intercept("GET", "/api/products*", (req) => {
    req.reply((res) => {
      setTimeout(() => {
        res.send({
          statusCode: 200,
          body: {
            success: true,
            data: {
              products: testData.products,
              pagination: {
                page: 1,
                pages: 1,
                limit: 12,
                total: testData.products.length,
              },
            },
          },
        });
      }, delay);
    });
  }).as("getProductsDelay");
});

// Comando para simular rede lenta
Cypress.Commands.add("simulateSlowNetwork", () => {
  cy.intercept("**", (req) => {
    req.reply((res) => {
      res.delay(2000);
    });
  });
});

// Comando para simular rede offline
Cypress.Commands.add("simulateOfflineNetwork", () => {
  cy.intercept("**", {
    statusCode: 0,
    body: null,
  });
});

// Comando para restaurar rede normal
Cypress.Commands.add("restoreNetwork", () => {
  cy.interceptAllApis();
});
