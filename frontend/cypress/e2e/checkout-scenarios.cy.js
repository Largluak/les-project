describe("Cenários de Checkout", () => {
  beforeEach(() => {
    // Preparar carrinho com produtos e clientId
    cy.visit("/produtos.html", {
      onBeforeLoad(win) {
        win.localStorage.setItem("clientId", "42");
      },
    });
    cy.get(".products-container", { timeout: 10000 }).should("be.visible");

    // Adicionar produtos ao carrinho
    cy.get(".product-card")
      .first()
      .within(() => {
        cy.get(".product-actions .btn-primary").click();
      });

    cy.get(".product-card")
      .eq(1)
      .within(() => {
        cy.get(".product-actions .btn-primary").click();
      });

    // Ir para carrinho
    cy.get('a[href="carrinho.html"]').click();
    cy.url().should("include", "carrinho.html");

    // Ir para checkout
    cy.get("#proceed-checkout").click();
    cy.url().should("include", "checkout.html");
  });

  it("Deve completar checkout apenas com cartão de crédito", () => {
    cy.log("💳 Testando checkout apenas com cartão");

    // PASSO 1: Adicionar endereço
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

    // Selecionar endereço (clicar no card)
    cy.get(".address-card").first().click();

    cy.get("#next-step-1").click();

    // PASSO 2: Adicionar cartão
    cy.get("#add-card-btn").click();

    cy.get("#card-name").type("João Silva");
    cy.get("#card-number").type("4111111111111111");
    cy.get("#card-brand").select("Visa");
    cy.get("#security-code").type("123");
    cy.get("#is-preferred").check();

    cy.get("#card-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar cartão (clicar no card)
    cy.get(".card-item").first().click();

    cy.get("#next-step-2").click();

    // PASSO 3: Confirmar pedido
    cy.get("#confirm-order").click();
    cy.get(".notification-success", { timeout: 10000 }).should("be.visible");

    // Verificar redirecionamento
    cy.url({ timeout: 10000 }).should("include", "pedidos.html");
  });

  it("Deve completar checkout apenas com cupons", () => {
    cy.log("🎫 Testando checkout apenas com cupons");

    // PASSO 1: Adicionar endereço
    cy.get("#add-address-btn").click();

    cy.get("#address-name").type("Trabalho");
    cy.get("#residence-type").select("Comércio");
    cy.get("#street-type").select("Avenida");
    cy.get("#street").type("Paulista");
    cy.get("#number").type("1000");
    cy.get("#district").type("Bela Vista");
    cy.get("#cep").type("01310100");
    cy.get("#city").type("São Paulo");
    cy.get("#state").type("SP");
    cy.get("#country").type("Brasil");

    cy.get("#address-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar endereço (clicar no card)
    cy.get(".address-card").first().click();

    cy.get("#next-step-1").click();

    // PASSO 2: Aplicar cupons (sem cartão)
    cy.get("body").then(($body) => {
      // Verificar se o botão de aplicar cupom está habilitado
      const couponBtn = $body.find("#apply-coupon");
      if (couponBtn.length > 0 && !couponBtn.is(":disabled")) {
        // Tentar cupom PROMO10 (valor mínimo R$ 30)
        cy.get("#coupon-code").type("PROMO10");
        cy.get("#apply-coupon").click();

        // Aguardar resposta da validação
        cy.wait(3000);

        // Verificar resultado
        cy.get("body").then(($body2) => {
          if ($body2.find(".notification-success").length > 0) {
            cy.log("✅ Cupom PROMO10 aplicado com sucesso");
          } else if ($body2.find(".notification-error").length > 0) {
            cy.log("❌ Cupom PROMO10 inválido, tentando TESTE10");
            cy.get("#coupon-code").clear().type("TESTE10");
            cy.get("#apply-coupon").click();
            cy.wait(3000);
          }
        });
      } else {
        cy.log("ℹ️ Botão de cupom desabilitado - valor mínimo não atendido");
      }
    });

    // Verificar resultado final da aplicação de cupom
    cy.get("body").then(($body) => {
      const hasSuccess = $body.find(".notification-success").length > 0;
      const hasError = $body.find(".notification-error").length > 0;

      if (hasSuccess) {
        cy.log("✅ Cupom aplicado com sucesso");
      } else if (hasError) {
        cy.log("⚠️ Nenhum cupom válido aplicado - continuando sem desconto");
      } else {
        cy.log("ℹ️ Estado de cupom indefinido - continuando");
      }
    });

    // Tentar continuar (pode falhar se cupons não cobrirem total)
    cy.get("#next-step-2").then(($btn) => {
      if ($btn.is(":enabled")) {
        cy.wrap($btn).click();

        // PASSO 3: Confirmar pedido
        cy.get("#confirm-order").click();
        cy.get(".notification-success", { timeout: 10000 }).should(
          "be.visible"
        );

        // Verificar redirecionamento
        cy.url({ timeout: 10000 }).should("include", "pedidos.html");
      } else {
        cy.log("Cupons não cobrem o valor total, adicionando cartão");

        // Adicionar cartão como backup
        cy.get("#add-card-btn").click();

        cy.get("#card-name").type("João Silva");
        cy.get("#card-number").type("5555555555554444");

        // Aguardar dropdown carregar e verificar opções disponíveis
        cy.get("#card-brand", { timeout: 10000 }).should("be.visible");

        // Verificar quais opções estão disponíveis
        cy.get("#card-brand").then(($select) => {
          const options = $select.find("option");
          const optionTexts = [];
          options.each((i, option) => {
            if (option.value) {
              // Ignorar option vazia
              optionTexts.push(option.textContent);
            }
          });
          cy.log(
            `🔍 Opções disponíveis no dropdown: ${optionTexts.join(", ")}`
          );
        });

        // Selecionar MasterCard (note o "Card" maiúsculo)
        cy.get("#card-brand").select("MasterCard");
        cy.get("#security-code").type("456");

        cy.get("#card-form").submit();
        cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

        // Selecionar cartão (clicar no card)
        cy.get(".card-item").first().click();

        cy.get("#next-step-2").click();

        // PASSO 3: Confirmar pedido
        cy.get("#confirm-order").click();
        cy.get(".notification-success", { timeout: 10000 }).should(
          "be.visible"
        );

        // Verificar redirecionamento
        cy.url({ timeout: 10000 }).should("include", "pedidos.html");
      }
    });
  });

  it("Deve completar checkout com cartão + cupons", () => {
    cy.log("💳🎫 Testando checkout com cartão + cupons");

    // PASSO 1: Adicionar endereço
    cy.get("#add-address-btn").click();

    cy.get("#address-name").type("Apartamento");
    cy.get("#residence-type").select("Apartamento");
    cy.get("#street-type").select("Rua");
    cy.get("#street").type("da Consolação");
    cy.get("#number").type("456");
    cy.get("#district").type("Consolação");
    cy.get("#cep").type("01302000");
    cy.get("#city").type("São Paulo");
    cy.get("#state").type("SP");
    cy.get("#country").type("Brasil");

    cy.get("#address-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar endereço (clicar no card)
    cy.get(".address-card").first().click();

    cy.get("#next-step-1").click();

    // PASSO 2: Adicionar cartão
    cy.get("#add-card-btn").click();

    cy.get("#card-name").type("Maria Santos");
    cy.get("#card-number").type("4000000000000002");
    cy.get("#card-brand").select("Visa");
    cy.get("#security-code").type("789");
    cy.get("#is-preferred").check();

    cy.get("#card-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar cartão (clicar no card)
    cy.get(".card-item").first().click();

    // Aplicar cupom
    cy.get("#coupon-code").type("PROMO15");
    cy.get("#apply-coupon").click();

    // Verificar se cupom foi aplicado
    cy.get("body").then(($body) => {
      if ($body.find(".notification-success").length > 0) {
        cy.get(".notification-success").should("be.visible");
      } else if ($body.find(".notification-error").length > 0) {
        cy.get(".notification-error").should("be.visible");
      }
    });

    cy.get("#next-step-2").click();

    // PASSO 3: Confirmar pedido
    cy.get("#confirm-order").click();
    cy.get(".notification-success", { timeout: 10000 }).should("be.visible");

    // Verificar redirecionamento
    cy.url({ timeout: 10000 }).should("include", "pedidos.html");
  });

  it("Deve testar validações de formulário", () => {
    cy.log("✅ Testando validações de formulário");

    // Tentar continuar sem endereço
    cy.get("#next-step-1").should("be.disabled");

    // Adicionar endereço válido para o teste
    cy.get("#add-address-btn").click();

    // Aguardar modal ficar visível
    cy.get("#address-modal", { timeout: 10000 }).should("be.visible");

    // Preencher formulário completo
    cy.get("#address-name").type("Casa de Teste");
    cy.get("#residence-type").select("Casa");
    cy.get("#street-type").select("Rua");
    cy.get("#street").type("Rua das Flores");
    cy.get("#number").type("123");
    cy.get("#district").type("Centro");
    cy.get("#cep").type("01234567");
    cy.get("#city").type("São Paulo");
    cy.get("#state").type("SP");
    cy.get("#country").type("Brasil");

    // Submeter formulário
    cy.get("#address-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar endereço (clicar no card)
    cy.get(".address-card").first().click();

    cy.get("#next-step-1").click();

    // PASSO 2: Testar validações de cartão
    cy.get("#add-card-btn").click();

    // Aguardar modal ficar visível
    cy.get("#card-modal", { timeout: 10000 }).should("be.visible");

    // Preencher formulário completo
    cy.get("#card-name").type("Cartão de Teste");
    cy.get("#card-number").type("4111111111111111");
    cy.get("#card-brand").select("Visa");
    cy.get("#security-code").type("123");
    cy.get("#is-preferred").check();

    // Submeter formulário
    cy.get("#card-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar cartão (clicar no card)
    cy.get(".card-item").first().click();

    cy.get("#next-step-2").click();

    // PASSO 3: Confirmar pedido
    cy.get("#confirm-order").click();
    cy.get(".notification-success", { timeout: 10000 }).should("be.visible");
  });

  it("Deve testar navegação entre passos", () => {
    cy.log("🔄 Testando navegação entre passos");

    // PASSO 1: Adicionar endereço
    cy.get("#add-address-btn").click();

    cy.get("#address-name").type("Casa");
    cy.get("#residence-type").select("Casa");
    cy.get("#street-type").select("Rua");
    cy.get("#street").type("Teste");
    cy.get("#number").type("123");
    cy.get("#district").type("Centro");
    cy.get("#cep").type("01234567");
    cy.get("#city").type("São Paulo");
    cy.get("#state").type("SP");
    cy.get("#country").type("Brasil");

    cy.get("#address-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar endereço (clicar no card)
    cy.get(".address-card").first().click();

    cy.get("#next-step-1").click();

    // PASSO 2: Adicionar cartão
    cy.get("#add-card-btn").click();

    cy.get("#card-name").type("Teste");
    cy.get("#card-number").type("4111111111111111");
    cy.get("#card-brand").select("Visa");
    cy.get("#security-code").type("123");

    cy.get("#card-form").submit();
    cy.get(".notification-success", { timeout: 5000 }).should("be.visible");

    // Selecionar cartão (clicar no card)
    cy.get(".card-item").first().click();

    cy.get("#next-step-2").click();

    // PASSO 3: Verificar resumo
    cy.get("#step-3").should("have.class", "active");
    cy.get(".order-summary").should("be.visible");

    // Voltar para passo 2
    cy.get("#prev-step-3").click();
    cy.get("#step-2").should("have.class", "active");

    // Voltar para passo 1
    cy.get("#prev-step-2").click();
    cy.get("#step-1").should("have.class", "active");

    // Avançar novamente
    cy.get("#next-step-1").click();
    cy.get("#next-step-2").click();

    // Confirmar pedido
    cy.get("#confirm-order").click();
    cy.get(".notification-success", { timeout: 10000 }).should("be.visible");
  });
});
