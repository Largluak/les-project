const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://127.0.0.1:57109/frontend", // URL base do frontend
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 2,
      openMode: 1,
    },
    env: {
      // Variáveis de ambiente para testes
      API_BASE_URL: "http://127.0.0.1:56206",
      TEST_CLIENT_ID: "1",
      TEST_TIMEOUT: 10000,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // Interceptar requisições de API para melhor controle
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });

      // Configurar interceptors para APIs
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--disable-features=VizDisplayCompositor");
        }
        return launchOptions;
      });
    },
  },
});
