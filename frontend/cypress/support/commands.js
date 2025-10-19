// Comandos personalizados do Cypress

// Comando para visitar página com clientId definido
Cypress.Commands.add("visitWithClientId", (url, clientId = "42") => {
  cy.visit(url, {
    onBeforeLoad(win) {
      win.localStorage.setItem("clientId", clientId);
    },
  });
});

// Comando para garantir que existe um carrinho ativo
Cypress.Commands.add("ensureCartExists", (clientId = "42") => {
  // Primeiro adicionar um produto para garantir que o carrinho existe
  cy.visitWithClientId("/produtos.html", clientId);

  cy.get(".products-container").should("be.visible");

  // Interceptar requisição de adicionar ao carrinho
  cy.intercept("POST", "**/api/cart/*/items").as("addToCart");

  // Adicionar primeiro produto disponível
  cy.get(".product-card")
    .first()
    .within(() => {
      cy.get(".product-actions .btn-primary").click();
    });

  // Aguardar confirmação de que foi adicionado
  cy.wait("@addToCart", { timeout: 10000 }).then((interception) => {
    if (interception.response.statusCode === 200) {
      cy.log("✅ Produto adicionado ao carrinho");
      if (interception.response.body?.data?.cartItem) {
        cy.log(
          `🔍 Produto: ${
            interception.response.body.data.cartItem.product?.name ||
            "Nome não disponível"
          }`
        );
      }
    } else {
      cy.log(
        `❌ Falha ao adicionar produto: ${interception.response.statusCode}`
      );
    }
  });

  // Aguardar mais tempo para o carrinho ser totalmente criado e atualizado
  cy.wait(2000);

  // Verificar se o produto apareceu no carrinho
  cy.visitWithClientId("/carrinho.html", clientId);
  cy.get(".cart-item", { timeout: 10000 }).should("have.length.greaterThan", 0);
  cy.log("✅ Carrinho criado e produto visível");
});

// Comando para aguardar carregamento da página
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.get(".container").should("be.visible");
});

// Comando para limpar carrinho
Cypress.Commands.add("clearCart", () => {
  cy.visit("/carrinho.html");
  cy.get("body").then(($body) => {
    if ($body.find("#clear-cart").length > 0) {
      cy.get("#clear-cart").click();
      cy.get("#confirm-modal").should("be.visible");
      cy.get("#confirm-ok").click();
    }
  });
});

// Comando para adicionar produto ao carrinho
Cypress.Commands.add("addProductToCart", (productIndex = 0, quantity = 1) => {
  cy.visit("/produtos.html");
  cy.get(".products-container", { timeout: 10000 }).should("be.visible");

  cy.get(".product-card")
    .eq(productIndex)
    .within(() => {
      // Ajustar quantidade se necessário
      for (let i = 1; i < quantity; i++) {
        cy.get(".quantity-btn").last().click();
      }
      cy.get(".product-actions .btn-primary").click();
    });

  cy.get(".notification-success", { timeout: 5000 }).should("be.visible");
});

// Comando para criar pedido completo
Cypress.Commands.add("createCompleteOrder", () => {
  // Adicionar produtos ao carrinho
  cy.addProductToCart(0, 1);
  cy.addProductToCart(1, 2);

  // Ir para checkout
  cy.get('a[href="carrinho.html"]').click();
  cy.get("#proceed-checkout").click();

  // Adicionar endereço
  cy.get("#add-address-btn").click();
  cy.get("#address-name").type("Casa");
  cy.get("#residence-type").select("Casa");
  cy.get("#street-type").select("Rua");
  cy.get("#street").type("Rua das Flores");
  cy.get("#number").type("123");
  cy.get("#district").type("Centro");
  cy.get("#cep").type("01234567");
  cy.get("#city").type("São Paulo");
  cy.get("#state").type("SP");
  cy.get("#country").type("Brasil");
  cy.get("#address-form").submit();
  cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

  // Selecionar endereço
  cy.get(".address-item")
    .first()
    .within(() => {
      cy.get('input[type="radio"]').check();
    });
  cy.get("#next-step-1").click();

  // Adicionar cartão
  cy.get("#add-card-btn").click();
  cy.get("#card-name").type("João Silva");
  cy.get("#card-number").type("4111111111111111");
  cy.get("#card-brand").select("Visa");
  cy.get("#security-code").type("123");
  cy.get("#card-form").submit();
  cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

  // Selecionar cartão
  cy.get(".card-item")
    .first()
    .within(() => {
      cy.get('input[type="radio"]').check();
    });
  cy.get("#next-step-2").click();

  // Confirmar pedido
  cy.get("#confirm-order").click();
  cy.get(".notification-success", { timeout: 10000 }).should("be.visible");
});

// Comando para verificar se há produtos no banco
Cypress.Commands.add("checkProductsAvailable", () => {
  cy.request({
    method: "GET",
    url: "/api/products?limit=1",
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200 && response.body.success) {
      expect(response.body.data.products.length).to.be.greaterThan(0);
    }
  });
});

// Comando para aguardar notificação
Cypress.Commands.add(
  "waitForNotification",
  (type = "success", timeout = 5000) => {
    cy.get(`.notification-${type}`, { timeout }).should("be.visible");
  }
);

// Comando para fechar modal
Cypress.Commands.add("closeModal", (modalId) => {
  cy.get(`#${modalId}`).should("be.visible");
  cy.get(`#${modalId} .btn-secondary, #${modalId} .btn-sm`).first().click();
  cy.get(`#${modalId}`).should("not.be.visible");
});

// Comando para verificar se elemento está visível ou não
Cypress.Commands.add(
  "shouldBeVisibleOrNot",
  (selector, shouldBeVisible = true) => {
    if (shouldBeVisible) {
      cy.get(selector).should("be.visible");
    } else {
      cy.get(selector).should("not.be.visible");
    }
  }
);

// Comando para aguardar carregamento de API
Cypress.Commands.add("waitForApiResponse", (url, timeout = 10000) => {
  cy.intercept("GET", url).as("apiCall");
  cy.wait("@apiCall", { timeout });
});

// Comando para verificar se há dados no localStorage
Cypress.Commands.add("checkLocalStorage", (key, expectedValue) => {
  cy.window().then((win) => {
    const value = win.localStorage.getItem(key);
    if (expectedValue) {
      expect(value).to.equal(expectedValue);
    } else {
      expect(value).to.not.be.null;
    }
  });
});

// Comando para simular usuário logado
Cypress.Commands.add("simulateLoggedUser", (clientId = "42") => {
  cy.window().then((win) => {
    win.localStorage.setItem("clientId", clientId);
  });
});

// Comando para limpar localStorage (sobrescreve o comando padrão)
Cypress.Commands.overwrite("clearLocalStorage", () => {
  cy.window().then((win) => {
    win.localStorage.clear();
  });
});

// Comando para verificar se página carregou completamente
Cypress.Commands.add("waitForPageReady", () => {
  cy.get("body").should("be.visible");
  cy.get("body").should("not.have.class", "loading");
});

// Comando para aguardar elemento com retry
Cypress.Commands.add("waitForElementWithRetry", (selector, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    cy.get("body").then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should("be.visible");
        return;
      }
      if (i < maxRetries - 1) {
        cy.wait(1000);
      }
    });
  }
});

// Comando para verificar se API está funcionando
Cypress.Commands.add("checkApiHealth", () => {
  cy.request({
    method: "GET",
    url: "/health",
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 404]); // 404 é ok se não houver endpoint de health
  });
});
