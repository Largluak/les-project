/**
 * Card Model - Gerencia dados e operações relacionadas aos cartões
 */
class CardModel {
  constructor() {
    this.baseUrl = "/api/clients";
  }

  /**
   * Criar novo cartão para um cliente
   * @param {number} clientId - ID do cliente
   * @param {Object} cardData - Dados do cartão
   * @returns {Promise<Object>} Cartão criado
   */
  async create(clientId, cardData) {
    try {
      const response = await fetch(`${this.baseUrl}/${clientId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao criar cartão");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      throw error;
    }
  }

  /**
   * Atualizar cartão
   * @param {number} clientId - ID do cliente
   * @param {number} cardId - ID do cartão
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} Cartão atualizado
   */
  async update(clientId, cardId, updateData) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${clientId}/cards/${cardId}`,
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
        throw new Error(error.message || "Erro ao atualizar cartão");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error);
      throw error;
    }
  }

  /**
   * Definir cartão como preferencial
   * @param {number} clientId - ID do cliente
   * @param {number} cardId - ID do cartão
   * @returns {Promise<Object>} Cartão atualizado
   */
  async setPreferred(clientId, cardId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${clientId}/cards/${cardId}/prefer`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao definir cartão preferencial");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao definir cartão preferencial:", error);
      throw error;
    }
  }

  /**
   * Deletar cartão
   * @param {number} clientId - ID do cliente
   * @param {number} cardId - ID do cartão
   * @returns {Promise<Object>} Resultado da operação
   */
  async delete(clientId, cardId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${clientId}/cards/${cardId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao deletar cartão");
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao deletar cartão:", error);
      throw error;
    }
  }

  /**
   * Validar dados do cartão
   * @param {Object} cardData - Dados do cartão
   * @returns {Object} Resultado da validação
   */
  validate(cardData) {
    const errors = [];

    if (!cardData.cardNumber) {
      errors.push("Número do cartão é obrigatório");
    } else if (!/^\d{13,19}$/.test(cardData.cardNumber.replace(/\s/g, ""))) {
      errors.push("Número do cartão deve ter entre 13 e 19 dígitos");
    }

    if (!cardData.cardName) {
      errors.push("Nome no cartão é obrigatório");
    }

    if (!cardData.brand) {
      errors.push("Bandeira do cartão é obrigatória");
    }

    if (!cardData.securityCode) {
      errors.push("Código de segurança é obrigatório");
    } else if (!/^\d{3,4}$/.test(cardData.securityCode)) {
      errors.push("Código de segurança deve ter 3 ou 4 dígitos");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Detectar bandeira do cartão pelo número
   * @param {string} cardNumber - Número do cartão
   * @returns {string} Bandeira detectada
   */
  detectBrand(cardNumber) {
    const number = cardNumber.replace(/\s/g, "");

    if (/^4/.test(number)) return "Visa";
    if (/^5[1-5]/.test(number)) return "Mastercard";
    if (/^3[47]/.test(number)) return "American Express";
    if (/^6/.test(number)) return "Discover";

    return "Outro";
  }

  /**
   * Formatar número do cartão para exibição
   * @param {string} cardNumber - Número do cartão
   * @returns {string} Número formatado
   */
  formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(" ");
  }

  /**
   * Mascarar número do cartão para exibição
   * @param {string} cardNumber - Número do cartão
   * @returns {string} Número mascarado
   */
  maskCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length < 8) return cardNumber;

    const firstFour = cleaned.substring(0, 4);
    const lastFour = cleaned.substring(cleaned.length - 4);
    const middle = "*".repeat(cleaned.length - 8);

    return `${firstFour} ${middle} ${lastFour}`;
  }
}

// Exportar instância única
window.CardModel = new CardModel();


