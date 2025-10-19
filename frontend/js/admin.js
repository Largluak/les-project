class AdminDashboard {
  constructor() {
    this.init();
  }

  init() {
    this.loadStats();
  }

  async loadStats() {
    try {
      // Carregar estatísticas de clientes
      await this.loadClientStats();

      // Carregar estatísticas de produtos
      await this.loadProductStats();

      // Carregar estatísticas de vendas (simuladas)
      this.loadSalesStats();
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  }

  async loadClientStats() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/clients`);
      const data = await response.json();

      // Verificar se a resposta tem a estrutura esperada
      let clients = [];
      if (data.clients && Array.isArray(data.clients)) {
        clients = data.clients;
      } else if (Array.isArray(data)) {
        clients = data;
      }

      if (clients && clients.length > 0) {
        document.getElementById("total-clients").textContent = clients.length;
      } else {
        document.getElementById("total-clients").textContent = "0";
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      document.getElementById("total-clients").textContent = "Erro";
    }
  }

  async loadProductStats() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/products`);
      const data = await response.json();

      if (data.success && data.data.products) {
        document.getElementById("total-books").textContent =
          data.data.products.length;
      } else {
        document.getElementById("total-books").textContent = "0";
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      document.getElementById("total-books").textContent = "Erro";
    }
  }

  loadSalesStats() {
    // Estatísticas simuladas (em produção viriam de uma API de vendas)
    document.getElementById("orders-today").textContent = "12";
    document.getElementById("sales-today").textContent = "R$ 1.247,50";
  }
}

// Inicializar dashboard quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  new AdminDashboard();
});
