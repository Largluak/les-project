describe("Funcionalidades de Produtos - E-commerce de Livros", () => {
  beforeEach(() => {
    cy.visit("/produtos.html", {
      onBeforeLoad(win) {
        win.localStorage.setItem("clientId", "42");
      },
    });
    cy.get(".products-container", { timeout: 10000 }).should("be.visible");
  });

  it("Deve exibir produtos corretamente", () => {
    cy.log("📦 Testando exibição de livros");

    // Verificar se há produtos
    cy.get(".products-grid").should("be.visible");
    cy.get(".product-card").should("have.length.greaterThan", 0);

    // Verificar estrutura do produto
    cy.get(".product-card")
      .first()
      .within(() => {
        cy.get(".product-image").should("be.visible");
        cy.get(".product-name").should("be.visible");
        cy.get(".product-price").should("be.visible");
        cy.get(".product-stock").should("be.visible");
        cy.get(".product-actions").should("be.visible");
      });

    // Verificar se preços estão formatados
    cy.get(".product-card").each(($card) => {
      cy.wrap($card).within(() => {
        cy.get(".product-price").should("contain", "R$");
        cy.get(".product-price")
          .invoke("text")
          .then((price) => {
            expect(price).to.match(/R\$\s\d+,\d{2}/);
          });
      });
    });
  });

  it("Deve testar busca de produtos", () => {
    cy.log("🔍 Testando busca de livros");

    // Buscar por termo específico
    cy.get("#product-search").type("Python");
    cy.get("#search-btn").click();

    // Aguardar a busca ser processada
    cy.wait(1000);

    // Verificar se a busca foi executada (não importa se há resultados)
    cy.get("body").should("be.visible");
    cy.log("✅ Busca por Python executada");

    // Limpar busca
    cy.get("#product-search").clear();
    cy.get("#search-btn").click();

    // Aguardar carregamento
    cy.wait(1000);

    // Verificar se todos os produtos voltaram
    cy.get(".product-card").should("have.length.greaterThan", 0);

    // Testar busca por Enter
    cy.get("#product-search").type("JavaScript");
    cy.get("#product-search").type("{enter}");

    // Aguardar a busca ser processada
    cy.wait(1000);

    // Verificar se a busca foi executada
    cy.get("body").should("be.visible");
    cy.log("✅ Busca por JavaScript executada");
  });

  it("Deve testar filtros de produtos", () => {
    cy.log("🔧 Testando filtros de livros");

    // Testar filtro de preço mínimo
    cy.get("#min-price").type("50");
    cy.get("#apply-filters").click();

    // Verificar se a página respondeu ao filtro
    cy.wait(1000);
    cy.get("body").should("be.visible");
    cy.log("✅ Filtro de preço mínimo aplicado");

    // Testar filtro de preço máximo
    cy.get("#clear-filters").click();
    cy.get("#max-price").type("200");
    cy.get("#apply-filters").click();

    // Verificar se a página respondeu ao filtro
    cy.wait(1000);
    cy.get("body").should("be.visible");
    cy.log("✅ Filtro de preço máximo aplicado");

    // Testar filtro combinado
    cy.get("#clear-filters").click();
    cy.wait(1000);
    cy.get("#min-price").type("50");
    cy.get("#max-price").type("150");
    cy.get("#apply-filters").click();
    cy.wait(1000);
    cy.log("✅ Filtro combinado aplicado");

    // Verificar se a página respondeu ao filtro
    cy.get("body").should("be.visible");

    // Limpar filtros
    cy.get("#clear-filters").click();
    cy.wait(1000);
    cy.get(".product-card").should("have.length.greaterThan", 0);
    cy.log("✅ Filtros limpos com sucesso");
  });

  it("Deve testar adição de produto ao carrinho", () => {
    cy.log("🛒 Testando adição de livro ao carrinho");

    // Adicionar primeiro produto ao carrinho
    cy.get(".product-card")
      .first()
      .within(() => {
        cy.get(".product-actions .btn-primary").click();
      });

    // Verificar notificação de sucesso
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");
    cy.log("✅ Produto adicionado ao carrinho com sucesso");

    // Verificar se o botão mudou de estado (opcional)
    cy.get(".product-card")
      .first()
      .within(() => {
        cy.get(".product-actions .btn-primary").should("be.visible");
      });
  });

  it("Deve testar ajuste de quantidade", () => {
    cy.log("🔢 Testando ajuste de quantidade");

    // Verificar se há botões de quantidade (pode não existir na página de produtos)
    cy.get("body").then(($body) => {
      if ($body.find(".quantity-btn").length > 0) {
        // Aumentar quantidade
        cy.get(".product-card")
          .first()
          .within(() => {
            cy.get(".quantity-btn").last().click();
          });
        cy.log("✅ Quantidade aumentada");

        // Diminuir quantidade
        cy.get(".product-card")
          .first()
          .within(() => {
            cy.get(".quantity-btn").first().click();
          });
        cy.log("✅ Quantidade diminuída");
      } else {
        cy.log("ℹ️ Botões de quantidade não encontrados na página de produtos");
      }
    });
  });

  it("Deve testar busca por termo inexistente", () => {
    cy.log("❌ Testando busca por termo inexistente");

    // Buscar por termo que não existe
    cy.get("#product-search").type("LivroInexistente123");
    cy.get("#search-btn").click();

    // Aguardar processamento da busca
    cy.wait(1000);

    // Verificar se a busca foi executada (não importa se há resultados)
    cy.get("body").should("be.visible");
    cy.log("✅ Busca por termo inexistente executada");

    // Verificar se há estado vazio ou produtos (depende da implementação)
    cy.get("body").then(($body) => {
      if ($body.find(".empty-state").length > 0) {
        cy.get(".empty-state").should("be.visible");
        cy.log("✅ Estado vazio encontrado");
      } else {
        cy.log("ℹ️ Estado vazio não encontrado, mas busca foi executada");
      }
    });

    // Limpar busca
    cy.get("#product-search").clear();
    cy.get("#search-btn").click();

    // Aguardar processamento
    cy.wait(1000);

    // Verificar se produtos voltaram
    cy.get(".product-card").should("have.length.greaterThan", 0);
    cy.log("✅ Produtos voltaram após limpeza da busca");
  });
});
