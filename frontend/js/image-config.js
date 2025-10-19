/**
 * Configuração de Imagens para Livros
 * Sistema simples de imagem padrão
 */

class ImageConfig {
  constructor() {
    // Caminho da imagem padrão de livro
    this.defaultBookImage = "images/image_books.jpg";

    // Caminho alternativo caso a imagem padrão não exista
    this.fallbackImage =
      "https://via.placeholder.com/300x400/4caf50/ffffff?text=Livro";

    // Configurações de imagem
    this.imageSettings = {
      width: 300,
      height: 400,
      alt: "Capa do Livro",
    };
  }

  /**
   * Retorna a URL da imagem padrão do livro
   * @returns {string} URL da imagem
   */
  getDefaultBookImage() {
    return this.defaultBookImage;
  }

  /**
   * Retorna a URL da imagem de fallback
   * @returns {string} URL da imagem de fallback
   */
  getFallbackImage() {
    return this.fallbackImage;
  }

  /**
   * Verifica se a imagem padrão existe
   * @returns {Promise<boolean>} True se a imagem existe
   */
  async checkDefaultImageExists() {
    try {
      const response = await fetch(this.defaultBookImage, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Retorna a melhor imagem disponível (padrão ou fallback)
   * @returns {Promise<string>} URL da imagem
   */
  async getBestAvailableImage() {
    const exists = await this.checkDefaultImageExists();
    return exists ? this.defaultBookImage : this.fallbackImage;
  }

  /**
   * Atualiza o caminho da imagem padrão
   * @param {string} newPath - Novo caminho da imagem
   */
  setDefaultImagePath(newPath) {
    this.defaultBookImage = newPath;
  }

  /**
   * Retorna as configurações de imagem
   * @returns {Object} Configurações de imagem
   */
  getImageSettings() {
    return this.imageSettings;
  }
}

// Instância global da configuração
window.imageConfig = new ImageConfig();

// Função utilitária para obter a imagem padrão
window.getDefaultBookImage = function () {
  return window.imageConfig.getDefaultBookImage();
};

// Função utilitária para obter a melhor imagem disponível
window.getBestBookImage = function () {
  return window.imageConfig.getBestAvailableImage();
};

// Função para atualizar o caminho da imagem padrão
window.setDefaultBookImage = function (newPath) {
  window.imageConfig.setDefaultImagePath(newPath);
};
