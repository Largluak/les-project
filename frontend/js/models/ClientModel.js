/**
 * Client Model - Gerencia dados e operações relacionadas aos clientes
 */
class ClientModel {
  constructor() {
    this.baseUrl = "/api/clients";
  }

  /**
   * Criar novo cliente
   * @param {Object} clientData - Dados do cliente
   * @returns {Promise<Object>} Cliente criado
   */
  async create(clientData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar cliente");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  /**
   * Buscar todos os clientes com filtros
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Lista de clientes com paginação
   */
  async findAll(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error("Erro ao buscar clientes");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw error;
    }
  }

  /**
   * Buscar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Dados do cliente
   */
  async findById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Cliente não encontrado");
        }
        throw new Error("Erro ao buscar cliente");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      throw error;
    }
  }

  /**
   * Atualizar cliente
   * @param {number} id - ID do cliente
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Cliente atualizado
   */
  async update(id, updateData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar cliente");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  }

  /**
   * Deletar cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar cliente");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  }

  /**
   * Alterar senha do cliente
   * @param {number} id - ID do cliente
   * @param {Object} passwordData - Dados da senha
   * @returns {Promise<Object>} Resultado da operação
   */
  async changePassword(id, passwordData) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao alterar senha");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  }

  /**
   * Alternar status do cliente (ativo/inativo)
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Cliente atualizado
   */
  async toggleStatus(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/toggle-status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao alterar status do cliente");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      throw error;
    }
  }

  /**
   * Atualizar ranking do cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Novo ranking
   */
  async updateRanking(id) {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/update-ranking`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar ranking");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar ranking:", error);
      throw error;
    }
  }

  /**
   * Buscar estatísticas do dashboard
   * @returns {Promise<Object>} Estatísticas
   */
  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/stats`);

      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }
}

// Exportar instância única
window.ClientModel = new ClientModel();


