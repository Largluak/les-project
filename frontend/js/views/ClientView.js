/**
 * Client View - Gerencia a interface do usuário relacionada aos clientes
 */
class ClientView {
  constructor() {
    this.clientController = window.ClientController;
    this.elements = {};
    this.currentClient = null;
  }

  /**
   * Inicializar a view
   * @param {Object} elements - Elementos DOM da página
   */
  init(elements) {
    this.elements = elements;
    this.setupEventListeners();
    this.loadClients();
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    // Botão de criar cliente
    if (this.elements.createButton) {
      this.elements.createButton.addEventListener("click", () =>
        this.showCreateForm()
      );
    }

    // Botão de buscar
    if (this.elements.searchButton) {
      this.elements.searchButton.addEventListener("click", () =>
        this.searchClients()
      );
    }

    // Campo de busca
    if (this.elements.searchInput) {
      this.elements.searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.searchClients();
      });
    }

    // Filtros
    if (this.elements.statusFilter) {
      this.elements.statusFilter.addEventListener("change", () =>
        this.loadClients()
      );
    }
  }

  /**
   * Carregar lista de clientes
   */
  async loadClients() {
    try {
      this.showLoading();

      const filters = this.getFilters();
      const result = await this.clientController.getClients(filters);

      if (result.success) {
        this.renderClientsList(result.data);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Erro ao carregar clientes");
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Buscar clientes
   */
  async searchClients() {
    await this.loadClients();
  }

  /**
   * Obter filtros ativos
   * @returns {Object} Filtros
   */
  getFilters() {
    const filters = {};

    if (this.elements.searchInput && this.elements.searchInput.value.trim()) {
      filters.name = this.elements.searchInput.value.trim();
    }

    if (
      this.elements.statusFilter &&
      this.elements.statusFilter.value !== "all"
    ) {
      filters.active = this.elements.statusFilter.value === "active";
    }

    return filters;
  }

  /**
   * Renderizar lista de clientes
   * @param {Object} data - Dados dos clientes
   */
  renderClientsList(data) {
    if (!this.elements.clientsList) return;

    const { clients, pagination } = data;

    if (clients.length === 0) {
      this.elements.clientsList.innerHTML = `
        <div class="no-data">
          <p>Nenhum cliente encontrado</p>
        </div>
      `;
      return;
    }

    const clientsHTML = clients
      .map((client) => this.renderClientItem(client))
      .join("");

    this.elements.clientsList.innerHTML = `
      <div class="clients-grid">
        ${clientsHTML}
      </div>
      ${this.renderPagination(pagination)}
    `;
  }

  /**
   * Renderizar item de cliente
   * @param {Object} client - Dados do cliente
   * @returns {string} HTML do item
   */
  renderClientItem(client) {
    const statusClass = client.active ? "active" : "inactive";
    const statusText = client.active ? "Ativo" : "Inativo";

    return `
      <div class="client-card ${statusClass}" data-client-id="${client.id}">
        <div class="client-header">
          <h3>${client.name}</h3>
          <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        
        <div class="client-info">
          <p><strong>E-mail:</strong> ${client.email}</p>
          <p><strong>CPF:</strong> ${client.cpf}</p>
          <p><strong>Código:</strong> ${client.clientCode}</p>
          <p><strong>Ranking:</strong> ${client.ranking}</p>
        </div>
        
        <div class="client-actions">
          <button class="btn btn-primary" onclick="clientView.viewClient(${client.id})">
            Ver Detalhes
          </button>
          <button class="btn btn-secondary" onclick="clientView.editClient(${client.id})">
            Editar
          </button>
          <button class="btn btn-danger" onclick="clientView.deleteClient(${client.id})">
            Excluir
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Renderizar paginação
   * @param {Object} pagination - Dados da paginação
   * @returns {string} HTML da paginação
   */
  renderPagination(pagination) {
    if (pagination.pages <= 1) return "";

    const { page, pages } = pagination;
    let paginationHTML = '<div class="pagination">';

    // Botão anterior
    if (page > 1) {
      paginationHTML += `<button class="btn btn-secondary" onclick="clientView.loadPage(${
        page - 1
      })">Anterior</button>`;
    }

    // Páginas
    for (let i = 1; i <= pages; i++) {
      const activeClass = i === page ? "active" : "";
      paginationHTML += `<button class="btn btn-secondary ${activeClass}" onclick="clientView.loadPage(${i})">${i}</button>`;
    }

    // Botão próximo
    if (page < pages) {
      paginationHTML += `<button class="btn btn-secondary" onclick="clientView.loadPage(${
        page + 1
      })">Próximo</button>`;
    }

    paginationHTML += "</div>";
    return paginationHTML;
  }

  /**
   * Carregar página específica
   * @param {number} page - Número da página
   */
  async loadPage(page) {
    // Implementar lógica de paginação
    await this.loadClients();
  }

  /**
   * Visualizar cliente
   * @param {number} id - ID do cliente
   */
  async viewClient(id) {
    try {
      this.showLoading();

      const result = await this.clientController.getClientById(id);

      if (result.success) {
        this.currentClient = result.data;
        this.showClientDetails(result.data);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Erro ao carregar cliente");
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Mostrar detalhes do cliente
   * @param {Object} client - Dados do cliente
   */
  showClientDetails(client) {
    // Implementar modal ou página de detalhes
    console.log("Mostrar detalhes do cliente:", client);
  }

  /**
   * Editar cliente
   * @param {number} id - ID do cliente
   */
  async editClient(id) {
    try {
      this.showLoading();

      const result = await this.clientController.getClientById(id);

      if (result.success) {
        this.currentClient = result.data;
        this.showEditForm(result.data);
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Erro ao carregar cliente");
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Mostrar formulário de edição
   * @param {Object} client - Dados do cliente
   */
  showEditForm(client) {
    // Implementar formulário de edição
    console.log("Mostrar formulário de edição:", client);
  }

  /**
   * Deletar cliente
   * @param {number} id - ID do cliente
   */
  async deleteClient(id) {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) {
      return;
    }

    try {
      this.showLoading();

      const result = await this.clientController.deleteClient(id);

      if (result.success) {
        this.showSuccess("Cliente excluído com sucesso");
        await this.loadClients();
      } else {
        this.showError(result.error);
      }
    } catch (error) {
      this.showError("Erro ao excluir cliente");
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Mostrar formulário de criação
   */
  showCreateForm() {
    // Implementar formulário de criação
    console.log("Mostrar formulário de criação");
  }

  /**
   * Mostrar loading
   */
  showLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = "block";
    }
  }

  /**
   * Esconder loading
   */
  hideLoading() {
    if (this.elements.loading) {
      this.elements.loading.style.display = "none";
    }
  }

  /**
   * Mostrar erro
   * @param {string} message - Mensagem de erro
   */
  showError(message) {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.style.display = "block";
      setTimeout(() => {
        this.elements.errorMessage.style.display = "none";
      }, 5000);
    }
  }

  /**
   * Mostrar sucesso
   * @param {string} message - Mensagem de sucesso
   */
  showSuccess(message) {
    if (this.elements.successMessage) {
      this.elements.successMessage.textContent = message;
      this.elements.successMessage.style.display = "block";
      setTimeout(() => {
        this.elements.successMessage.style.display = "none";
      }, 3000);
    }
  }
}

// Exportar instância única
window.ClientView = new ClientView();


