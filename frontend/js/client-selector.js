class ClientSelector {
  constructor() {
    this.connectedClient = null;
    this.init();
  }

  init() {
    // Verificar se há cliente conectado no localStorage
    const savedClient = localStorage.getItem("connectedClient");
    if (savedClient) {
      this.connectedClient = JSON.parse(savedClient);
      this.showConnectedClient();
    }
  }

  async loadClients() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/clients`);
      const data = await response.json();

      console.log("Resposta da API:", data); // Debug

      // Verificar se a resposta tem a estrutura esperada
      let clients = [];
      if (data.clients && Array.isArray(data.clients)) {
        clients = data.clients;
      } else if (Array.isArray(data)) {
        clients = data;
      }

      if (clients && clients.length > 0) {
        this.renderClientList(clients);
      } else {
        this.showError("Nenhum cliente encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      this.showError(
        "Erro ao carregar clientes. Verifique se o backend está rodando."
      );
    }
  }

  renderClientList(clients) {
    const clientList = document.getElementById("client-list");

    if (clients.length === 0) {
      clientList.innerHTML =
        '<p class="no-clients">Nenhum cliente encontrado</p>';
      return;
    }

    clientList.innerHTML = clients
      .map(
        (client) => `
      <div class="client-item" onclick="clientSelector.selectClient(${client.id}, '${client.name}', '${client.gender}')">
        <div class="client-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="client-info">
          <h4>${client.name}</h4>
          <p>ID: ${client.id} | ${client.gender}</p>
          <small>${client.clientCode}</small>
        </div>
        <div class="client-action">
          <i class="fas fa-arrow-right"></i>
        </div>
      </div>
    `
      )
      .join("");
  }

  selectClient(clientId, clientName, clientGender) {
    this.connectedClient = {
      id: clientId,
      name: clientName,
      gender: clientGender,
    };

    // Salvar no localStorage
    localStorage.setItem(
      "connectedClient",
      JSON.stringify(this.connectedClient)
    );

    // Esconder seletor e mostrar cliente conectado
    this.hideClientSelector();
    this.showConnectedClient();
  }

  showConnectedClient() {
    if (!this.connectedClient) return;

    document.getElementById("connected-name").textContent =
      this.connectedClient.name;
    document.getElementById("connected-id").textContent =
      this.connectedClient.id;
    document.getElementById("connected-gender").textContent =
      this.connectedClient.gender;

    document.getElementById("connected-client").style.display = "block";
  }

  hideConnectedClient() {
    document.getElementById("connected-client").style.display = "none";
    this.connectedClient = null;
    localStorage.removeItem("connectedClient");
  }

  showClientSelector() {
    document.getElementById("client-selector").style.display = "block";
    this.loadClients();
  }

  hideClientSelector() {
    document.getElementById("client-selector").style.display = "none";
  }

  showError(message) {
    const clientList = document.getElementById("client-list");
    clientList.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
      </div>
    `;
  }
}

// Instância global
const clientSelector = new ClientSelector();

// Funções globais para os botões
function toggleClientSelector() {
  const selector = document.getElementById("client-selector");
  if (selector.style.display === "none") {
    clientSelector.showClientSelector();
  } else {
    clientSelector.hideClientSelector();
  }
}

function accessAdmin() {
  // Redirecionar para área administrativa
  window.location.href = "admin.html";
}

function accessAsClient() {
  if (!clientSelector.connectedClient) {
    alert("Nenhum cliente selecionado");
    return;
  }

  // Redirecionar para produtos com o cliente conectado
  window.location.href = `produtos.html?clientId=${clientSelector.connectedClient.id}`;
}

function disconnectClient() {
  clientSelector.hideConnectedClient();
  clientSelector.showClientSelector();
}

// Verificar se há cliente conectado ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  if (clientSelector.connectedClient) {
    clientSelector.showConnectedClient();
  }
});
