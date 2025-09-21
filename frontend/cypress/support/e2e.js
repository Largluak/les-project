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

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Configurações globais para os testes
Cypress.on("uncaught:exception", (err, runnable) => {
  // Não falhar o teste em erros não capturados do JavaScript
  // que podem ocorrer durante os testes
  return false;
});

// Configuração para interceptar requisições da API
beforeEach(() => {
  // Interceptar requisições para a API do backend
  cy.intercept("GET", "http://localhost:4000/api/**").as("apiGet");
  cy.intercept("POST", "http://localhost:4000/api/**").as("apiPost");
  cy.intercept("PUT", "http://localhost:4000/api/**").as("apiPut");
  cy.intercept("PATCH", "http://localhost:4000/api/**").as("apiPatch");
  cy.intercept("DELETE", "http://localhost:4000/api/**").as("apiDelete");
});




