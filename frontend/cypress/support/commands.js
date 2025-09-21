// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Comandos personalizados para os testes de clientes

// Comando para preencher dados pessoais do cliente
Cypress.Commands.add("fillClientPersonalData", (clientData) => {
  cy.get("#nome").type(clientData.name);
  cy.get("#genero").select(clientData.gender);
  cy.get("#nascimento").type(clientData.birthDate);
  cy.get("#cpf").type(clientData.cpf);
  cy.get("#telefone").type(clientData.phone);
  cy.get("#email").type(clientData.email);
  cy.get("#senha").type(clientData.password);
  cy.get("#confirmarSenha").type(clientData.passwordConfirm);
});

// Comando para preencher dados de endereço
Cypress.Commands.add("fillAddressData", (addressData, addressNumber = 1) => {
  cy.get(`#tipoEndereco${addressNumber}`).select(addressData.residenceType);
  cy.get(`#tipoLogradouro${addressNumber}`).select(addressData.streetType);
  cy.get(`#logradouro${addressNumber}`).type(addressData.street);
  cy.get(`#numero${addressNumber}`).type(addressData.number);
  cy.get(`#bairro${addressNumber}`).type(addressData.district);
  cy.get(`#cep${addressNumber}`).type(addressData.cep);
  cy.get(`#cidade${addressNumber}`).type(addressData.city);
  cy.get(`#estado${addressNumber}`).select(addressData.state);

  // Quebrar a cadeia de comandos para evitar problemas de DOM desconectado
  cy.get(`#pais${addressNumber}`).clear();
  cy.get(`#pais${addressNumber}`).type(addressData.country);

  if (addressData.observations) {
    cy.get(`#observacoes${addressNumber}`).type(addressData.observations);
  }

  if (addressData.isBilling) {
    cy.get(`#enderecoCobranca${addressNumber}`).check();
  }

  if (addressData.isDelivery) {
    cy.get(`#enderecoEntrega${addressNumber}`).check();
  }
});

// Comando para adicionar um novo endereço
Cypress.Commands.add("addNewAddress", () => {
  cy.get("#btnAdicionarEndereco").click();
  // Aguardar um pouco para a página estabilizar após adicionar endereço
  cy.wait(500);
});

// Comando para remover um endereço específico
Cypress.Commands.add("removeAddress", (addressNumber) => {
  cy.get(`[data-endereco="${addressNumber}"] .btn-remove-endereco`).click();
});

// Comando para navegar para uma página específica
Cypress.Commands.add("navigateToPage", (pageName) => {
  cy.get("nav").contains(pageName).click();
});

// Comando para aguardar carregamento da lista de clientes
Cypress.Commands.add("waitForClientsList", () => {
  cy.get("#tabelaClientes tbody").should("be.visible");
  // Aguardar também os campos de filtro estarem disponíveis
  cy.get("#filtroNome").should("be.visible");
  cy.get("#filtroEmail").should("be.visible");
});

// Comando para aguardar carregamento da lista de endereços
Cypress.Commands.add("waitForAddressesList", () => {
  cy.get("#tabelaEnderecos tbody").should("be.visible");
  // Aguardar que haja pelo menos um endereço na lista
  cy.get("#tabelaEnderecos tbody tr").should("have.length.at.least", 1);
});

// Comando para filtrar clientes
Cypress.Commands.add("filterClients", (name = "", email = "") => {
  if (name) {
    cy.get("#filtroNome").clear().type(name);
  }
  if (email) {
    cy.get("#filtroEmail").clear().type(email);
  }
  cy.get("button").contains("Filtrar").click();
});

// Comando para editar cliente
Cypress.Commands.add("editClient", (clientName) => {
  // Validar se o nome do cliente não está vazio
  if (!clientName || clientName.trim() === "") {
    throw new Error("Nome do cliente não pode estar vazio");
  }

  cy.get("#tabelaClientes tbody tr")
    .contains(clientName)
    .parent()
    .find("button")
    .contains("Editar")
    .click();
});

// Comando para inativar cliente
Cypress.Commands.add("inactivateClient", (clientName) => {
  cy.get("#tabelaClientes tbody tr")
    .contains(clientName)
    .parent()
    .find("button")
    .contains("Inativar")
    .click();
});

// Comando para remover cliente
Cypress.Commands.add("removeClient", (clientName) => {
  cy.get("#tabelaClientes tbody tr")
    .contains(clientName)
    .parent()
    .find("button")
    .contains("Remover")
    .click();
});

// Comando para editar endereço
Cypress.Commands.add("editAddress", (clientName) => {
  cy.get("#tabelaEnderecos tbody tr")
    .contains(clientName)
    .parent()
    .find("button")
    .contains("Editar")
    .click();
});

// Comando para remover endereço
Cypress.Commands.add("removeAddressFromList", (clientName) => {
  cy.get("#tabelaEnderecos tbody tr")
    .contains(clientName)
    .parent()
    .find("button")
    .contains("Remover")
    .click();
});

// Comando para preencher modal de edição de cliente
Cypress.Commands.add("fillEditClientModal", (clientData) => {
  cy.get("#editNome").clear().type(clientData.name);
  cy.get("#editEmail").clear().type(clientData.email);
  cy.get("#editTelefone").clear().type(clientData.phone);
  cy.get("#editRanking").clear().type(clientData.ranking);
  cy.get("#editStatus").select(clientData.status);
});

// Comando para preencher modal de edição de endereço
Cypress.Commands.add("fillEditAddressModal", (addressData) => {
  cy.get("#editTipo").select(addressData.residenceType);
  cy.get("#editLogradouro").clear().type(addressData.street);
  cy.get("#editNumero").clear().type(addressData.number);
  cy.get("#editBairro").clear().type(addressData.district);
  cy.get("#editCidade").clear().type(addressData.city);
  cy.get("#editCep").clear().type(addressData.cep);
  cy.get("#editEstado").clear().type(addressData.state);
  cy.get("#editPais").clear().type(addressData.country);

  if (addressData.observations) {
    cy.get("#editObservacoes").clear().type(addressData.observations);
  }
});

// Comando para confirmar modal de confirmação
Cypress.Commands.add("confirmModal", () => {
  cy.get("#modalConfirmacao .btn-danger").click();
});

// Comando para cancelar modal de confirmação
Cypress.Commands.add("cancelModal", () => {
  cy.get("#modalConfirmacao .btn-cancel").click();
});

// Comando para fechar modal
Cypress.Commands.add("closeModal", () => {
  cy.get(".modal .close").click();
});
