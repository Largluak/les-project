/// <reference types="cypress" />

describe("Teste Básico - Verificação de Funcionamento", () => {
  it("Deve carregar a página de cadastro de clientes", () => {
    cy.visit("/cadastrarClientes.html");

    // Verificar se a página carregou
    cy.get("h2").should("contain", "Cadastrar Cliente");

    // Verificar se os campos principais estão presentes
    cy.get("#nome").should("be.visible");
    cy.get("#email").should("be.visible");
    cy.get("#cpf").should("be.visible");

    // Verificar se há pelo menos um endereço
    cy.get(".endereco-item").should("have.length.at.least", 1);

    console.log("✅ Página carregada com sucesso!");
  });

  it("Deve carregar a página de listagem de clientes", () => {
    cy.visit("/listarClientes.html");

    // Verificar se a página carregou
    cy.get("h2").should("contain", "Clientes Cadastrados");

    // Verificar se a tabela está presente
    cy.get("#tabelaClientes").should("be.visible");

    console.log("✅ Página de listagem carregada com sucesso!");
  });

  it("Deve carregar a página de endereços", () => {
    cy.visit("/listarEndereco.html");

    // Verificar se a página carregou
    cy.get("h3").should("contain", "Endereços cadastrados");

    // Verificar se a tabela está presente
    cy.get("#tabelaEnderecos").should("be.visible");

    console.log("✅ Página de endereços carregada com sucesso!");
  });
});




