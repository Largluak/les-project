/**********************************
 * CONFIGURAÇÃO BASE DA API
 **********************************/
const API_BASE = "http://localhost:4000/api";

/**********************************
 * UTILITÁRIOS GERAIS
 **********************************/
function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(ddd, number) {
  if (number.length === 9) {
    return `(${ddd}) ${number.substring(0, 5)}-${number.substring(5)}`;
  }
  return `(${ddd}) ${number.substring(0, 4)}-${number.substring(4)}`;
}

function showAlert(message, type = "info") {
  alert(message); // Pode ser substituído por uma lib de notificações
}

function validateCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let check = (sum * 10) % 11;
  if (check === 10) check = 0;
  if (check !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  check = (sum * 10) % 11;
  if (check === 10) check = 0;
  return check === parseInt(cpf[10]);
}

/**********************************
 * DASHBOARD - PÁGINA INICIAL
 **********************************/
async function carregarDashboard() {
  const totalElement = document.getElementById("totalClientes");
  const inativosElement = document.getElementById("clientesInativos");
  const melhorElement = document.getElementById("melhorCliente");

  if (!totalElement) return; // Não está na página do dashboard

  try {
    const res = await fetch(`${API_BASE}/clients/dashboard/stats`);
    const stats = await res.json();

    totalElement.textContent = stats.totalClients;
    inativosElement.textContent = stats.inactiveClientes;
    melhorElement.textContent = stats.topClient;
  } catch (err) {
    console.error("Erro ao carregar dashboard:", err);
  }
}

/**********************************
 * CADASTRAR CLIENTE
 **********************************/
const formCliente = document.getElementById("formCadastrarCliente");
if (formCliente) {
  formCliente.addEventListener("submit", async function (e) {
    e.preventDefault();

    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const telefone = document
      .getElementById("telefone")
      .value.replace(/\D/g, "");
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validações básicas no frontend
    if (!validateCPF(cpf)) {
      showAlert("CPF inválido!", "error");
      return;
    }

    if (senha !== confirmarSenha) {
      showAlert("Senhas não coincidem!", "error");
      return;
    }

    const payload = {
      name: document.getElementById("nome").value.trim(),
      gender: document.getElementById("genero").value,
      birthDate: document.getElementById("nascimento").value,
      cpf: cpf,
      email: document.getElementById("email").value.trim(),
      password: senha,
      passwordConfirm: confirmarSenha,
      phone: {
        type: "mobile",
        ddd: telefone.substring(0, 2),
        number: telefone.substring(2),
      },
      // Por enquanto cliente será cadastrado sem endereços/cartões
      // Serão adicionados separadamente
      addresses: [],
      cards: [],
    };

    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro no servidor");
      }

      showAlert("Cliente cadastrado com sucesso!", "success");
      formCliente.reset();

      // Se estiver na página de listagem, recarrega
      if (typeof listarClientes === "function") {
        listarClientes();
      }
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      showAlert(`Erro ao cadastrar: ${err.message}`, "error");
    }
  });
}

/**********************************
 * LISTAR CLIENTES
 **********************************/
async function listarClientes() {
  const tabela = document.querySelector("#tabelaClientes tbody");
  if (!tabela) return;

  try {
    const res = await fetch(`${API_BASE}/clients`);
    const data = await res.json();
    const clientes = data.clients || data; // Support both formats

    tabela.innerHTML = "";

    if (clientes.length === 0) {
      tabela.innerHTML =
        '<tr><td colspan="6">Nenhum cliente encontrado</td></tr>';
      return;
    }

    clientes.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${formatPhone(c.phoneDDD || "", c.phoneNumber || "")}</td>
        <td>${c.ranking}</td>
        <td>
          <span class="status ${c.active ? "ativo" : "inativo"}">
            ${c.active ? "Ativo" : "Inativo"}
          </span>
        </td>
        <td>
          <button class="btn-neutral" onclick="editarCliente(${c.id})">
            Editar
          </button>
          <button class="${c.active ? "btn-cancel" : "btn-confirm"}" 
                  onclick="alterarStatusCliente(${c.id}, ${!c.active})">
            ${c.active ? "Inativar" : "Ativar"}
          </button>
          <button class="btn-info" onclick="verDetalhes(${c.id})">
            Detalhes
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao listar clientes:", err);
    showAlert("Erro ao carregar clientes", "error");
  }
}

async function filtrarClientes() {
  const nome = document.getElementById("filtroNome")?.value || "";
  const email = document.getElementById("filtroEmail")?.value || "";

  const params = new URLSearchParams();
  if (nome) params.append("name", nome);
  if (email) params.append("email", email);

  try {
    const res = await fetch(`${API_BASE}/clients?${params}`);
    const data = await res.json();
    const clientes = data.clients || data;

    const tabela = document.querySelector("#tabelaClientes tbody");
    tabela.innerHTML = "";

    clientes.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${formatPhone(c.phoneDDD || "", c.phoneNumber || "")}</td>
        <td>${c.ranking}</td>
        <td>
          <span class="status ${c.active ? "ativo" : "inativo"}">
            ${c.active ? "Ativo" : "Inativo"}
          </span>
        </td>
        <td>
          <button class="btn-neutral" onclick="editarCliente(${c.id})">
            Editar
          </button>
          <button class="${c.active ? "btn-cancel" : "btn-confirm"}" 
                  onclick="alterarStatusCliente(${c.id}, ${!c.active})">
            ${c.active ? "Inativar" : "Ativar"}
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao filtrar:", err);
  }
}

async function alterarStatusCliente(id, ativar) {
  try {
    const res = await fetch(`${API_BASE}/clients/${id}/toggle-status`, {
      method: "PATCH",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    showAlert(
      `Cliente ${ativar ? "ativado" : "inativado"} com sucesso!`,
      "success"
    );
    listarClientes();
  } catch (err) {
    console.error("Erro ao alterar status:", err);
    showAlert("Erro ao alterar status do cliente", "error");
  }
}

/**********************************
 * CADASTRAR ENDEREÇOS
 **********************************/
const formEndereco = document.getElementById("formEndereco");
if (formEndereco) {
  formEndereco.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Por simplicidade, usando cliente ID=1 fixo
    // Em um app real, seria do cliente logado ou selecionado
    const clienteId = localStorage.getItem("clienteAtual") || 1;

    const payload = {
      name: `${document.getElementById("tipoEndereco").value} - ${
        document.getElementById("logradouro").value
      }`,
      residenceType: document.getElementById("tipoEndereco").value,
      streetType: "Rua", // Fixo por enquanto
      street: document.getElementById("logradouro").value,
      number: document.getElementById("numero").value,
      district: document.getElementById("bairro").value,
      cep: document.getElementById("cep").value.replace(/\D/g, ""),
      city: document.getElementById("cidade").value,
      state: document.getElementById("estado").value,
      country: document.getElementById("pais").value || "Brasil",
      observations: document.getElementById("observacoes").value,
      isBilling: false, // Por padrão
      isDelivery: true, // Por padrão
    };

    try {
      const res = await fetch(`${API_BASE}/clients/${clienteId}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      showAlert("Endereço cadastrado com sucesso!", "success");
      formEndereco.reset();

      if (typeof listarEnderecos === "function") {
        listarEnderecos();
      }
    } catch (err) {
      console.error("Erro ao cadastrar endereço:", err);
      showAlert(`Erro ao cadastrar endereço: ${err.message}`, "error");
    }
  });
}

/**********************************
 * LISTAR ENDEREÇOS
 **********************************/
async function listarEnderecos() {
  const tabela = document.querySelector("#tabelaEnderecos tbody");
  if (!tabela) return;

  try {
    const res = await fetch(`${API_BASE}/clients`);
    const data = await res.json();
    const clientes = data.clients || data;

    tabela.innerHTML = "";

    clientes.forEach((c) => {
      (c.addresses || []).forEach((e) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.name}</td>
          <td>${e.residenceType}</td>
          <td>${e.street}</td>
          <td>${e.number}</td>
          <td>${e.district}</td>
          <td>${e.city}</td>
          <td>${e.cep}</td>
          <td>${e.state}</td>
          <td>${e.country}</td>
          <td>${e.observations || ""}</td>
          <td>
            <button class="btn-neutral" onclick="editarEndereco(${c.id}, ${
          e.id
        })">
              Editar
            </button>
            <button class="btn-cancel" onclick="removerEndereco(${c.id}, ${
          e.id
        })">
              Remover
            </button>
          </td>
        `;
        tabela.appendChild(row);
      });
    });
  } catch (err) {
    console.error("Erro ao listar endereços:", err);
  }
}

/**********************************
 * CADASTRAR CARTÕES
 **********************************/
const formCartao = document.getElementById("formCartao");
if (formCartao) {
  formCartao.addEventListener("submit", async function (e) {
    e.preventDefault();

    const clienteId = localStorage.getItem("clienteAtual") || 1;

    const payload = {
      cardNumber: document
        .getElementById("numeroCartao")
        .value.replace(/\D/g, ""),
      cardName: document.getElementById("nomeCartao").value,
      brand: document.getElementById("bandeiraCartao").value,
      securityCode: document.getElementById("codigoSeguranca").value,
      isPreferred: document.getElementById("preferencial").checked,
    };

    try {
      const res = await fetch(`${API_BASE}/clients/${clienteId}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      showAlert("Cartão cadastrado com sucesso!", "success");
      formCartao.reset();

      if (typeof listarCartoes === "function") {
        listarCartoes();
      }
    } catch (err) {
      console.error("Erro ao cadastrar cartão:", err);
      showAlert(`Erro ao cadastrar cartão: ${err.message}`, "error");
    }
  });
}

/**********************************
 * LISTAR CARTÕES
 **********************************/
async function listarCartoes() {
  const tabela = document.querySelector("#tabelaCartoes tbody");
  if (!tabela) return;

  try {
    const res = await fetch(`${API_BASE}/clients`);
    const data = await res.json();
    const clientes = data.clients || data;

    tabela.innerHTML = "";

    clientes.forEach((c) => {
      (c.cards || []).forEach((cartao) => {
        const numeroMascarado = `**** **** **** ${cartao.cardNumber.slice(-4)}`;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${c.name}</td>
          <td>${numeroMascarado}</td>
          <td>${cartao.cardName}</td>
          <td>${cartao.brand}</td>
          <td>***</td>
          <td>
            <span class="${cartao.isPreferred ? "preferencial" : ""}">
              ${cartao.isPreferred ? "Sim" : "Não"}
            </span>
          </td>
          <td>
            <button class="btn-neutral" onclick="editarCartao(${c.id}, ${
          cartao.id
        })">
              Editar
            </button>
            <button class="btn-confirm" onclick="definirPreferencial(${c.id}, ${
          cartao.id
        })">
              Preferencial
            </button>
            <button class="btn-cancel" onclick="removerCartao(${cartao.id})">
              Remover
            </button>
          </td>
        `;
        tabela.appendChild(row);
      });
    });
  } catch (err) {
    console.error("Erro ao listar cartões:", err);
  }
}

async function definirPreferencial(clienteId, cartaoId) {
  try {
    const res = await fetch(
      `${API_BASE}/clients/${clienteId}/cards/${cartaoId}/prefer`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    showAlert("Cartão definido como preferencial!", "success");
    listarCartoes();
  } catch (err) {
    console.error("Erro ao definir preferencial:", err);
    showAlert("Erro ao definir cartão preferencial", "error");
  }
}

/**********************************
 * ALTERAR SENHA
 **********************************/
const formSenha = document.getElementById("formSenha");
if (formSenha) {
  formSenha.addEventListener("submit", async function (e) {
    e.preventDefault();

    const novaSenha = document.getElementById("novaSenha").value;
    const confirmar = document.getElementById("confirmNovaSenha").value;

    if (novaSenha !== confirmar) {
      showAlert("Senhas não coincidem!", "error");
      return;
    }

    // Por simplicidade, usando cliente ID=1
    const clienteId = localStorage.getItem("clienteAtual") || 1;

    try {
      const res = await fetch(`${API_BASE}/clients/${clienteId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: "SenhaAtual@123", // Em prod, pedir senha atual
          newPassword: novaSenha,
          newPasswordConfirm: confirmar,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      showAlert("Senha alterada com sucesso!", "success");
      formSenha.reset();
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      showAlert(`Erro ao alterar senha: ${err.message}`, "error");
    }
  });
}

/**********************************
 * INICIALIZAÇÃO AUTOMÁTICA
 **********************************/
document.addEventListener("DOMContentLoaded", () => {
  // Carrega dados conforme a página
  carregarDashboard();
  listarClientes();
  listarEnderecos();
  listarCartoes();

  // Adiciona máscara de CPF se existir campo
  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      e.target.value = value;
    });
  }

  // Adiciona máscara de telefone se existir campo
  const telefoneInput = document.getElementById("telefone");
  if (telefoneInput) {
    telefoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{4})(\d)/, "$1-$2");
      } else {
        value = value.replace(/(\d{2})(\d)/, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
      }
      e.target.value = value;
    });
  }
});
