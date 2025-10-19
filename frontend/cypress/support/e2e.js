// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using CommonJS syntax:
require("./commands");
require("./api-interceptors");

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais para os testes
Cypress.on("uncaught:exception", (err, runnable) => {
  // Não falhar o teste em erros não capturados do JavaScript
  // que podem ocorrer durante os testes
  return false;
});

// Configuração global para interceptar requisições da API
beforeEach(() => {
  // Interceptar requisições para a API do backend
  cy.intercept("GET", "**/api/**").as("apiGet");
  cy.intercept("POST", "**/api/**").as("apiPost");
  cy.intercept("PUT", "**/api/**").as("apiPut");
  cy.intercept("PATCH", "**/api/**").as("apiPatch");
  cy.intercept("DELETE", "**/api/**").as("apiDelete");

  // Configurar interceptadores específicos para testes de vendas
  cy.interceptAllApis();
});

// Configuração para aguardar carregamento da página
beforeEach(() => {
  // Aguardar carregamento básico da página
  cy.get("body").should("be.visible");
});

// Configuração para simular usuário logado
beforeEach(() => {
  // Simular usuário logado para todos os testes
  cy.simulateLoggedUser("1");
});
