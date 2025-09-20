/**
 * Aplicação Principal - Inicializa e coordena os componentes MVC
 */
class App {
  constructor() {
    this.models = {};
    this.controllers = {};
    this.views = {};
    this.currentPage = null;
  }

  /**
   * Inicializar aplicação
   */
  async init() {
    try {
      console.log("🚀 Inicializando aplicação...");

      // Carregar modelos
      await this.loadModels();

      // Carregar controladores
      await this.loadControllers();

      // Carregar views
      await this.loadViews();

      // Inicializar página atual
      await this.initCurrentPage();

      console.log("✅ Aplicação inicializada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao inicializar aplicação:", error);
      this.showError("Erro ao inicializar aplicação");
    }
  }

  /**
   * Carregar modelos
   */
  async loadModels() {
    console.log("📦 Carregando modelos...");

    // Os modelos são carregados via script tags no HTML
    // Aqui apenas verificamos se estão disponíveis
    const requiredModels = ["ClientModel", "AddressModel", "CardModel"];

    for (const modelName of requiredModels) {
      if (!window[modelName]) {
        throw new Error(`Modelo ${modelName} não encontrado`);
      }
      this.models[modelName] = window[modelName];
    }

    console.log("✅ Modelos carregados");
  }

  /**
   * Carregar controladores
   */
  async loadControllers() {
    console.log("🎮 Carregando controladores...");

    const requiredControllers = ["ClientController"];

    for (const controllerName of requiredControllers) {
      if (!window[controllerName]) {
        throw new Error(`Controlador ${controllerName} não encontrado`);
      }
      this.controllers[controllerName] = window[controllerName];
    }

    console.log("✅ Controladores carregados");
  }

  /**
   * Carregar views
   */
  async loadViews() {
    console.log("🖼️ Carregando views...");

    const requiredViews = ["ClientView"];

    for (const viewName of requiredViews) {
      if (!window[viewName]) {
        throw new Error(`View ${viewName} não encontrada`);
      }
      this.views[viewName] = window[viewName];
    }

    console.log("✅ Views carregadas");
  }

  /**
   * Inicializar página atual
   */
  async initCurrentPage() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split("/").pop();

    console.log(`📄 Inicializando página: ${currentFile}`);

    switch (currentFile) {
      case "listarClientes.html":
        await this.initClientListPage();
        break;
      case "cadastrarClientes.html":
        await this.initClientCreatePage();
        break;
      case "index.html":
        await this.initDashboardPage();
        break;
      default:
        console.log(
          `⚠️ Página ${currentFile} não possui inicialização específica`
        );
    }
  }

  /**
   * Inicializar página de lista de clientes
   */
  async initClientListPage() {
    const elements = {
      clientsList: document.getElementById("clients-list"),
      createButton: document.getElementById("create-client-btn"),
      searchInput: document.getElementById("search-input"),
      searchButton: document.getElementById("search-btn"),
      statusFilter: document.getElementById("status-filter"),
      loading: document.getElementById("loading"),
      errorMessage: document.getElementById("error-message"),
      successMessage: document.getElementById("success-message"),
    };

    // Verificar se todos os elementos necessários existem
    const missingElements = Object.entries(elements)
      .filter(([key, element]) => !element)
      .map(([key]) => key);

    if (missingElements.length > 0) {
      console.warn(
        `⚠️ Elementos não encontrados: ${missingElements.join(", ")}`
      );
    }

    this.views.ClientView.init(elements);
    this.currentPage = "client-list";
  }

  /**
   * Inicializar página de criação de cliente
   */
  async initClientCreatePage() {
    console.log("📝 Inicializando página de criação de cliente");
    // Implementar inicialização específica da página de criação
    this.currentPage = "client-create";
  }

  /**
   * Inicializar página do dashboard
   */
  async initDashboardPage() {
    console.log("📊 Inicializando dashboard");
    // Implementar inicialização específica do dashboard
    this.currentPage = "dashboard";
  }

  /**
   * Mostrar erro global
   * @param {string} message - Mensagem de erro
   */
  showError(message) {
    // Criar elemento de erro se não existir
    let errorElement = document.getElementById("global-error");
    if (!errorElement) {
      errorElement = document.createElement("div");
      errorElement.id = "global-error";
      errorElement.className = "global-error";
      errorElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = "block";

    setTimeout(() => {
      errorElement.style.display = "none";
    }, 5000);
  }

  /**
   * Mostrar sucesso global
   * @param {string} message - Mensagem de sucesso
   */
  showSuccess(message) {
    // Criar elemento de sucesso se não existir
    let successElement = document.getElementById("global-success");
    if (!successElement) {
      successElement = document.createElement("div");
      successElement.id = "global-success";
      successElement.className = "global-success";
      successElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 300px;
      `;
      document.body.appendChild(successElement);
    }

    successElement.textContent = message;
    successElement.style.display = "block";

    setTimeout(() => {
      successElement.style.display = "none";
    }, 3000);
  }

  /**
   * Obter instância de um modelo
   * @param {string} modelName - Nome do modelo
   * @returns {Object} Instância do modelo
   */
  getModel(modelName) {
    return this.models[modelName];
  }

  /**
   * Obter instância de um controlador
   * @param {string} controllerName - Nome do controlador
   * @returns {Object} Instância do controlador
   */
  getController(controllerName) {
    return this.controllers[controllerName];
  }

  /**
   * Obter instância de uma view
   * @param {string} viewName - Nome da view
   * @returns {Object} Instância da view
   */
  getView(viewName) {
    return this.views[viewName];
  }
}

// Instância global da aplicação
window.app = new App();

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  window.app.init();
});

// Exportar para uso global
window.App = App;
