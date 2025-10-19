describe("Funcionalidades de Pedidos", () => {
  beforeEach(() => {
    // Interceptar chamada da API antes de visitar a página
    cy.intercept("GET", "**/api/orders/client/**").as("getOrders");
    cy.visit("/pedidos.html");
    cy.get(".orders-container", { timeout: 10000 }).should("be.visible");
  });

  it("Deve exibir lista de pedidos", () => {
    cy.log("📋 Testando exibição de pedidos");

    // Aguardar a resposta da API
    cy.wait("@getOrders");

    // Verificar a resposta da API
    cy.get("@getOrders").then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body.success).to.be.true;

      const orders = interception.response.body.data.orders || [];
      cy.log(`API retornou ${orders.length} pedidos`);

      if (orders.length > 0) {
        // Deve exibir pedidos
        cy.get(".order-card").should("have.length", orders.length);

        // Verificar estrutura do primeiro pedido
        cy.get(".order-card")
          .first()
          .within(() => {
            cy.get(".order-header").should("be.visible");
            cy.get(".order-info h3").should("contain", "Pedido #");
            cy.get(".order-date").should("be.visible");
            cy.get(".order-status").should("be.visible");
            cy.get(".status-badge").should("be.visible");
            cy.get(".order-items").should("be.visible");
            cy.get(".order-footer").should("be.visible");
            cy.get(".order-total").should("be.visible");
            cy.get(".order-actions").should("be.visible");
          });
      } else {
        // Deve exibir estado vazio
        cy.get(".empty-state").should("be.visible");
        cy.get(".empty-state h3").should("contain", "Nenhum pedido encontrado");
      }
    });
  });

  it("Deve testar filtros de pedidos", () => {
    cy.log("🔧 Testando filtros de pedidos");

    // Testar filtro por status
    cy.get("#status-filter").select("OPEN");
    cy.get("#apply-filters").click();

    // Verificar se filtros foram aplicados
    cy.get(".order-card").each(($card) => {
      cy.wrap($card).within(() => {
        cy.get(".status-badge").should("contain", "Em Aberto");
      });
    });

    // Testar filtro por período
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    cy.get("#start-date").type(lastWeek.toISOString().split("T")[0]);
    cy.get("#end-date").type(today.toISOString().split("T")[0]);
    cy.get("#apply-filters").click();

    // Verificar se filtros foram aplicados
    cy.get(".orders-list").should("be.visible");

    // Limpar filtros
    cy.get("#clear-filters").click();

    // Verificar se todos os pedidos voltaram
    cy.get(".orders-list").should("be.visible");
  });

  it("Deve testar busca por número do pedido", () => {
    cy.log("🔍 Testando busca por número do pedido");

    // Buscar por termo genérico
    cy.get("#order-search").type("PED");
    cy.get("#search-order").click();

    // Verificar se busca foi executada
    cy.get(".orders-list").should("be.visible");

    // Testar busca por Enter
    cy.get("#order-search").clear();
    cy.get("#order-search").type("123");
    cy.get("#order-search").type("{enter}");

    // Verificar se busca foi executada
    cy.get(".orders-list").should("be.visible");

    // Limpar busca
    cy.get("#order-search").clear();
    cy.get("#search-order").click();
  });

  it("Deve testar visualização de detalhes do pedido", () => {
    cy.log("👁️ Testando visualização de detalhes");

    // Verificar se há pedidos
    cy.get("body").then(($body) => {
      if ($body.find(".order-card").length > 0) {
        // Clicar em "Ver Detalhes" do primeiro pedido
        cy.get(".order-card")
          .first()
          .within(() => {
            cy.get("button").contains("Ver Detalhes").click();
          });

        // Verificar se modal abriu
        cy.get("#order-modal").should("be.visible");
        cy.get("#order-details").should("be.visible");

        // Verificar conteúdo do modal
        cy.get(".order-detail-header").should("be.visible");
        cy.get(".order-detail-info").should("be.visible");

        // Verificar seções de informações
        cy.get(".info-section").should("have.length.greaterThan", 0);

        // Verificar informações do pedido
        cy.get(".info-section")
          .first()
          .within(() => {
            cy.get("h5").should("contain", "Informações do Pedido");
          });

        // Verificar endereço de entrega
        cy.get(".info-section")
          .eq(1)
          .within(() => {
            cy.get("h5").should("contain", "Endereço de Entrega");
          });

        // Verificar itens do pedido
        cy.get(".info-section")
          .eq(2)
          .within(() => {
            cy.get("h5").should("contain", "Itens do Pedido");
          });

        // Fechar modal
        cy.get("#close-modal-btn").click();
        cy.get("#order-modal").should("not.be.visible");
      }
    });
  });

  it("Deve testar solicitação de troca", () => {
    cy.log("🔄 Testando solicitação de troca");

    // Verificar se há pedidos entregues
    cy.get("body").then(($body) => {
      if ($body.find(".order-card").length > 0) {
        // Filtrar por pedidos entregues
        cy.get("#status-filter").select("DELIVERED");
        cy.get("#apply-filters").click();

        // Verificar se há pedidos entregues
        cy.get("body").then(($body) => {
          if ($body.find(".order-card").length > 0) {
            // Clicar em "Ver Detalhes" do primeiro pedido entregue
            cy.get(".order-card")
              .first()
              .within(() => {
                cy.get("button").contains("Ver Detalhes").click();
              });

            // Verificar se modal de detalhes abriu
            cy.get("#order-modal").should("be.visible");

            // Verificar se botão de troca está visível
            cy.get("#request-exchange-btn").should("be.visible");

            // Clicar em solicitar troca
            cy.get("#request-exchange-btn").click();

            // Verificar se modal de troca abriu
            cy.get("#exchange-modal").should("be.visible");

            // Verificar formulário de troca
            cy.get("#exchange-form").should("be.visible");
            cy.get("#exchange-product").should("be.visible");
            cy.get("#exchange-quantity").should("be.visible");
            cy.get("#exchange-reason").should("be.visible");

            // Preencher formulário de troca
            cy.get("#exchange-product").select(1); // Selecionar primeiro produto
            cy.get("#exchange-quantity").type("1");
            cy.get("#exchange-reason").select("Produto defeituoso");

            // Submeter solicitação de troca
            cy.get("#submit-exchange").click();

            // Verificar notificação de sucesso
            cy.get(".notification-success", { timeout: 10000 }).should(
              "be.visible"
            );

            // Verificar se modais fecharam
            cy.get("#exchange-modal").should("not.be.visible");
            cy.get("#order-modal").should("not.be.visible");
          }
        });

        // Limpar filtros
        cy.get("#clear-filters").click();
      }
    });
  });

  it('Deve testar motivo "Outro" na troca', () => {
    cy.log('📝 Testando motivo "Outro" na troca');

    // Verificar se há pedidos entregues
    cy.get("#status-filter").select("DELIVERED");
    cy.get("#apply-filters").click();

    cy.get("body").then(($body) => {
      if ($body.find(".order-card").length > 0) {
        // Abrir detalhes do pedido
        cy.get(".order-card")
          .first()
          .within(() => {
            cy.get("button").contains("Ver Detalhes").click();
          });

        // Solicitar troca
        cy.get("#request-exchange-btn").click();

        // Selecionar motivo "Outro"
        cy.get("#exchange-reason").select("Outro");

        // Verificar se campo de especificação apareceu
        cy.get("#other-reason-group").should("be.visible");
        cy.get("#other-reason").should("be.visible");

        // Preencher motivo específico
        cy.get("#other-reason").type("Produto não atendeu às expectativas");

        // Preencher outros campos
        cy.get("#exchange-product").select(1);
        cy.get("#exchange-quantity").type("1");

        // Submeter
        cy.get("#submit-exchange").click();

        // Verificar notificação
        cy.get(".notification-success", { timeout: 10000 }).should(
          "be.visible"
        );
      }
    });

    // Limpar filtros
    cy.get("#clear-filters").click();
  });

  it("Deve testar paginação de pedidos", () => {
    cy.log("📄 Testando paginação de pedidos");

    // Verificar se há paginação
    cy.get("body").then(($body) => {
      if ($body.find(".pagination").length > 0) {
        cy.get(".pagination").should("be.visible");

        // Testar navegação entre páginas
        cy.get(".pagination-controls").within(() => {
          // Verificar se há botão "Próximo"
          if (cy.get("button").contains("Próximo").length > 0) {
            cy.get("button").contains("Próximo").click();

            // Verificar se página mudou
            cy.get(".orders-list").should("be.visible");

            // Voltar para página anterior
            cy.get("button").contains("Anterior").click();
            cy.get(".orders-list").should("be.visible");
          }
        });
      }
    });
  });

  it("Deve testar status badges dos pedidos", () => {
    cy.log("🏷️ Testando status badges");

    // Verificar se há pedidos
    cy.get("body").then(($body) => {
      if ($body.find(".order-card").length > 0) {
        // Verificar diferentes status
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

        cy.get(".order-card").each(($card) => {
          cy.wrap($card).within(() => {
            cy.get(".status-badge").should("be.visible");
            cy.get(".status-badge")
              .invoke("text")
              .then((statusText) => {
                // Verificar se o status é válido
                const validStatuses = Object.values(statusMap);
                expect(validStatuses).to.include(statusText);
              });
          });
        });
      }
    });
  });

  it("Deve testar responsividade da página de pedidos", () => {
    cy.log("📱 Testando responsividade");

    // Testar em diferentes tamanhos de tela
    cy.viewport(375, 667); // Mobile
    cy.get(".orders-container").should("be.visible");
    cy.get(".filters-section").should("be.visible");
    cy.get(".search-section").should("be.visible");

    cy.viewport(768, 1024); // Tablet
    cy.get(".orders-container").should("be.visible");
    cy.get(".filters-section").should("be.visible");
    cy.get(".search-section").should("be.visible");

    cy.viewport(1280, 720); // Desktop
    cy.get(".orders-container").should("be.visible");
    cy.get(".filters-section").should("be.visible");
    cy.get(".search-section").should("be.visible");
  });

  it("Deve testar validações do formulário de troca", () => {
    cy.log("✅ Testando validações do formulário de troca");

    // Verificar se há pedidos entregues
    cy.get("#status-filter").select("DELIVERED");
    cy.get("#apply-filters").click();

    cy.get("body").then(($body) => {
      if ($body.find(".order-card").length > 0) {
        // Abrir detalhes do pedido
        cy.get(".order-card")
          .first()
          .within(() => {
            cy.get("button").contains("Ver Detalhes").click();
          });

        // Solicitar troca
        cy.get("#request-exchange-btn").click();

        // Tentar submeter formulário vazio
        cy.get("#submit-exchange").click();

        // Verificar se formulário não foi submetido (validação)
        cy.get("#exchange-modal").should("be.visible");

        // Preencher apenas produto
        cy.get("#exchange-product").select(1);
        cy.get("#submit-exchange").click();

        // Verificar se ainda não foi submetido
        cy.get("#exchange-modal").should("be.visible");

        // Preencher quantidade
        cy.get("#exchange-quantity").type("1");
        cy.get("#submit-exchange").click();

        // Verificar se ainda não foi submetido
        cy.get("#exchange-modal").should("be.visible");

        // Preencher motivo
        cy.get("#exchange-reason").select("Produto defeituoso");
        cy.get("#submit-exchange").click();

        // Verificar se foi submetido com sucesso
        cy.get(".notification-success", { timeout: 10000 }).should(
          "be.visible"
        );
      }
    });

    // Limpar filtros
    cy.get("#clear-filters").click();
  });
});
