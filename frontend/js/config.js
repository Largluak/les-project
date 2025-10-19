// Configuração da API
const API_CONFIG = {
  // URL base da API - ajuste conforme necessário
  BASE_URL: "http://localhost:4000/api",

  // Headers padrão para requisições
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // Timeout para requisições (em ms)
  TIMEOUT: 10000,
};

// Função para fazer requisições HTTP
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const config = {
    method: "GET",
    headers: { ...API_CONFIG.DEFAULT_HEADERS },
    timeout: API_CONFIG.TIMEOUT,
    ...options,
  };

  try {
    console.log(`🌐 Fazendo requisição: ${config.method} ${url}`);

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Resposta recebida:`, data);

    return data;
  } catch (error) {
    console.error(`❌ Erro na requisição ${url}:`, error);
    throw error;
  }
}

// Funções específicas da API
const API = {
  // Clientes
  getClients: () => apiRequest("/clients"),
  getClient: (id) => apiRequest(`/clients/${id}`),
  createClient: (data) =>
    apiRequest("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateClient: (id, data) =>
    apiRequest(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteClient: (id) =>
    apiRequest(`/clients/${id}`, {
      method: "DELETE",
    }),

  // Produtos
  getProducts: () => apiRequest("/products"),
  getProduct: (id) => apiRequest(`/products/${id}`),
  createProduct: (data) =>
    apiRequest("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id, data) =>
    apiRequest(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id) =>
    apiRequest(`/products/${id}`, {
      method: "DELETE",
    }),

  // Pedidos
  getOrders: () => apiRequest("/orders"),
  getOrder: (id) => apiRequest(`/orders/${id}`),
  createOrder: (data) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateOrder: (id, data) =>
    apiRequest(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Cupons
  getCoupons: () => apiRequest("/coupons"),
  getCoupon: (code) => apiRequest(`/coupons/${code}`),
  createCoupon: (data) =>
    apiRequest("/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Carrinho
  getCart: (clientId) => apiRequest(`/cart/${clientId}`),
  addToCart: (data) =>
    apiRequest("/cart/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCartItem: (data) =>
    apiRequest("/cart/update", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  removeFromCart: (data) =>
    apiRequest("/cart/remove", {
      method: "DELETE",
      body: JSON.stringify(data),
    }),

  // Health check
  health: () => apiRequest("/health"),
};

// Exportar para uso global
window.API = API;
window.API_CONFIG = API_CONFIG;

console.log("🔧 Configuração da API carregada!");
console.log(`📍 URL base: ${API_CONFIG.BASE_URL}`);
