/**
 * Address Model - Gerencia dados e operações relacionadas aos endereços
 */
class AddressModel {
  constructor() {
    this.baseUrl = "/api/clients";
  }

  /**
   * Criar novo endereço para um cliente
   * @param {number} clientId - ID do cliente
   * @param {Object} addressData - Dados do endereço
   * @returns {Promise<Object>} Endereço criado
   */
  async create(clientId, addressData) {
    try {
      const response = await fetch(`${this.baseUrl}/${clientId}/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar endereço");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      throw error;
    }
  }

  /**
   * Atualizar endereço
   * @param {number} clientId - ID do cliente
   * @param {number} addressId - ID do endereço
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Endereço atualizado
   */
  async update(clientId, addressId, updateData) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${clientId}/addresses/${addressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao atualizar endereço");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      throw error;
    }
  }

  /**
   * Deletar endereço
   * @param {number} clientId - ID do cliente
   * @param {number} addressId - ID do endereço
   * @returns {Promise<Object>} Resultado da operação
   */
  async delete(clientId, addressId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${clientId}/addresses/${addressId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar endereço");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      throw error;
    }
  }

  /**
   * Validar dados do endereço
   * @param {Object} addressData - Dados do endereço
   * @returns {Object} Resultado da validação
   */
  validate(addressData) {
    const errors = [];

    if (!addressData.residenceType) {
      errors.push("Tipo de residência é obrigatório");
    }

    if (!addressData.streetType) {
      errors.push("Tipo de logradouro é obrigatório");
    }

    if (!addressData.street) {
      errors.push("Nome da rua é obrigatório");
    }

    if (!addressData.number) {
      errors.push("Número é obrigatório");
    }

    if (!addressData.district) {
      errors.push("Bairro é obrigatório");
    }

    if (!addressData.cep) {
      errors.push("CEP é obrigatório");
    } else if (!/^\d{5}-?\d{3}$/.test(addressData.cep)) {
      errors.push("CEP deve ter formato válido (00000-000)");
    }

    if (!addressData.city) {
      errors.push("Cidade é obrigatória");
    }

    if (!addressData.state) {
      errors.push("Estado é obrigatório");
    }

    if (!addressData.country) {
      errors.push("País é obrigatório");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Formatar endereço para exibição
   * @param {Object} address - Dados do endereço
   * @returns {string} Endereço formatado
   */
  formatAddress(address) {
    const parts = [
      address.streetType,
      address.street,
      address.number,
      address.district,
      address.city,
      address.state,
      address.country,
    ].filter((part) => part);

    return parts.join(", ");
  }
}

// Exportar instância única
window.AddressModel = new AddressModel();
