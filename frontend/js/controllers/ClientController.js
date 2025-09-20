/**
 * Client Controller - Controla a lógica de negócio relacionada aos clientes
 */
class ClientController {
  constructor() {
    this.clientModel = window.ClientModel;
    this.addressModel = window.AddressModel;
    this.cardModel = window.CardModel;
  }

  /**
   * Criar novo cliente
   * @param {Object} clientData - Dados do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async createClient(clientData) {
    try {
      // Validar dados obrigatórios
      const validation = this.validateClientData(clientData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Validar endereços se fornecidos
      if (clientData.addresses && clientData.addresses.length > 0) {
        const addressValidation = this.validateAddresses(clientData.addresses);
        if (!addressValidation.isValid) {
          throw new Error(addressValidation.errors.join(", "));
        }
      }

      // Validar cartões se fornecidos
      if (clientData.cards && clientData.cards.length > 0) {
        const cardValidation = this.validateCards(clientData.cards);
        if (!cardValidation.isValid) {
          throw new Error(cardValidation.errors.join(", "));
        }
      }

      const result = await this.clientModel.create(clientData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao criar cliente:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar clientes com filtros
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Resultado da operação
   */
  async getClients(filters = {}) {
    try {
      const result = await this.clientModel.findAll(filters);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao buscar clientes:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async getClientById(id) {
    try {
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      const result = await this.clientModel.findById(id);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao buscar cliente:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar cliente
   * @param {number} id - ID do cliente
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Resultado da operação
   */
  async updateClient(id, updateData) {
    try {
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      // Validar dados se fornecidos
      if (updateData.name || updateData.email || updateData.cpf) {
        const validation = this.validateClientData(updateData, true);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }
      }

      const result = await this.clientModel.update(id, updateData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao atualizar cliente:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletar cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async deleteClient(id) {
    try {
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      const result = await this.clientModel.delete(id);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao deletar cliente:", error);
      return { success: false, error: error.message };
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
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      const validation = this.validatePasswordData(passwordData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      const result = await this.clientModel.changePassword(id, passwordData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao alterar senha:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Alternar status do cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async toggleClientStatus(id) {
    try {
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      const result = await this.clientModel.toggleStatus(id);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao alterar status:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Atualizar ranking do cliente
   * @param {number} id - ID do cliente
   * @returns {Promise<Object>} Resultado da operação
   */
  async updateRanking(id) {
    try {
      if (!id) {
        throw new Error("ID do cliente é obrigatório");
      }

      const result = await this.clientModel.updateRanking(id);
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao atualizar ranking:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Buscar estatísticas do dashboard
   * @returns {Promise<Object>} Resultado da operação
   */
  async getDashboardStats() {
    try {
      const result = await this.clientModel.getDashboardStats();
      return { success: true, data: result };
    } catch (error) {
      console.error("Erro no controller ao buscar estatísticas:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validar dados do cliente
   * @param {Object} clientData - Dados do cliente
   * @param {boolean} isUpdate - Se é uma atualização
   * @returns {Object} Resultado da validação
   */
  validateClientData(clientData, isUpdate = false) {
    const errors = [];

    if (!isUpdate) {
      if (!clientData.name) errors.push("Nome é obrigatório");
      if (!clientData.email) errors.push("E-mail é obrigatório");
      if (!clientData.cpf) errors.push("CPF é obrigatório");
      if (!clientData.password) errors.push("Senha é obrigatória");
      if (!clientData.birthDate)
        errors.push("Data de nascimento é obrigatória");
      if (!clientData.gender) errors.push("Gênero é obrigatório");
      if (!clientData.phone) errors.push("Telefone é obrigatório");
    }

    if (
      clientData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)
    ) {
      errors.push("E-mail deve ter formato válido");
    }

    if (clientData.cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(clientData.cpf)) {
      errors.push("CPF deve ter formato válido (000.000.000-00)");
    }

    if (clientData.phone) {
      if (!clientData.phone.type) errors.push("Tipo de telefone é obrigatório");
      if (!clientData.phone.ddd) errors.push("DDD é obrigatório");
      if (!clientData.phone.number)
        errors.push("Número do telefone é obrigatório");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Validar dados de senha
   * @param {Object} passwordData - Dados da senha
   * @returns {Object} Resultado da validação
   */
  validatePasswordData(passwordData) {
    const errors = [];

    if (!passwordData.oldPassword) errors.push("Senha atual é obrigatória");
    if (!passwordData.newPassword) errors.push("Nova senha é obrigatória");
    if (!passwordData.newPasswordConfirm)
      errors.push("Confirmação da nova senha é obrigatória");

    if (passwordData.newPassword && passwordData.newPassword.length < 6) {
      errors.push("Nova senha deve ter pelo menos 6 caracteres");
    }

    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      errors.push("Nova senha e confirmação não coincidem");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Validar endereços
   * @param {Array} addresses - Lista de endereços
   * @returns {Object} Resultado da validação
   */
  validateAddresses(addresses) {
    const errors = [];

    if (!Array.isArray(addresses)) {
      errors.push("Endereços devem ser um array");
      return { isValid: false, errors };
    }

    addresses.forEach((address, index) => {
      const validation = this.addressModel.validate(address);
      if (!validation.isValid) {
        validation.errors.forEach((error) => {
          errors.push(`Endereço ${index + 1}: ${error}`);
        });
      }
    });

    // Verificar se há pelo menos um endereço de cobrança e entrega
    const hasBilling = addresses.some((addr) => addr.isBilling);
    const hasDelivery = addresses.some((addr) => addr.isDelivery);

    if (addresses.length > 0) {
      if (!hasBilling)
        errors.push("É obrigatório pelo menos um endereço de cobrança");
      if (!hasDelivery)
        errors.push("É obrigatório pelo menos um endereço de entrega");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Validar cartões
   * @param {Array} cards - Lista de cartões
   * @returns {Object} Resultado da validação
   */
  validateCards(cards) {
    const errors = [];

    if (!Array.isArray(cards)) {
      errors.push("Cartões devem ser um array");
      return { isValid: false, errors };
    }

    cards.forEach((card, index) => {
      const validation = this.cardModel.validate(card);
      if (!validation.isValid) {
        validation.errors.forEach((error) => {
          errors.push(`Cartão ${index + 1}: ${error}`);
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }
}

// Exportar instância única
window.ClientController = new ClientController();


