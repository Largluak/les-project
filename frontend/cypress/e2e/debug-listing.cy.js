/// <reference types="cypress" />

describe("Debug - Verificação de Elementos", () => {
  it("Deve encontrar todos os elementos da página de listagem", () => {
    cy.visit("/listarClientes.html");

    // Aguardar a página carregar completamente
    cy.get("h2").should("contain", "Clientes Cadastrados");

    // Verificar se os campos de filtro existem
    cy.get("#filtroNome").should("be.visible");
    cy.get("#filtroEmail").should("be.visible");

    // Verificar se o botão de filtrar existe
    cy.get("button").contains("Filtrar").should("be.visible");

    // Verificar se a tabela existe
    cy.get("#tabelaClientes").should("be.visible");

    console.log("✅ Todos os elementos foram encontrados!");
  });

  it("Deve testar filtro por nome com dados simples", () => {
    cy.visit("/listarClientes.html");

    // Aguardar elementos estarem disponíveis
    cy.get("#filtroNome").should("be.visible");
    cy.get("#filtroEmail").should("be.visible");

    // Testar filtro com texto simples
    cy.get("#filtroNome").clear().type("João");
    cy.get("button").contains("Filtrar").click();

    // Aguardar um pouco para a filtragem acontecer
    cy.wait(1000);

    console.log("✅ Filtro por nome executado com sucesso!");
  });
});




