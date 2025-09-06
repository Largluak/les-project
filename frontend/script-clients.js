/**********************************
 * CONFIGURAÇÃO BASE DA API
 **********************************/
const API_BASE = "http://localhost:4000/api";

/**********************************
 * CADASTRAR CLIENTE
 **********************************/
const formCliente = document.getElementById("formCadastrarCliente");
if (formCliente) {
  formCliente.addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
      name: document.getElementById("nome").value,
      gender: document.getElementById("genero").value,
      birthDate: document.getElementById("nascimento").value,
      cpf: document.getElementById("cpf").value.replace(/\D/g, ""),
      email: document.getElementById("email").value,
      password: document.getElementById("senha").value,
      passwordConfirm: document.getElementById("confirmarSenha").value,
      phone: {
        type: "mobile",
        ddd: document
          .getElementById("telefone")
          .value.replace(/\D/g, "")
          .substring(0, 2),
        number: document
          .getElementById("telefone")
          .value.replace(/\D/g, "")
          .substring(2),
      },
      addresses: [],
      cards: [],
    };

    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await res.json();
      alert("Cliente cadastrado com sucesso!");
      formCliente.reset();
    } catch (err) {
      alert("Erro ao cadastrar: " + (err.message || JSON.stringify(err)));
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
    const clientes = await res.json();

    tabela.innerHTML = "";
    clientes.forEach((c) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>(${c.phoneDDD || ""}) ${c.phoneNumber || ""}</td>
        <td>${c.ranking}</td>
        <td>${c.active ? "Ativo" : "Inativo"}</td>
        <td>
          <button class="btn-neutral" onclick="editarCliente(${
            c.id
          })">Editar</button>
          <button class="${
            c.active ? "btn-cancel" : "btn-confirm"
          }" onclick="inativarCliente(${c.id})">
            ${c.active ? "Inativar" : "Ativar"}
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

async function inativarCliente(id) {
  try {
    const res = await fetch(`${API_BASE}/clients/${id}/inactivate`, {
      method: "PATCH",
    });
    if (!res.ok) throw await res.json();
    listarClientes();
  } catch (err) {
    alert("Erro ao alterar status");
  }
}

/**********************************
 * LISTAR ENDEREÇOS
 **********************************/
async function listarEnderecos() {
  const tabela = document.querySelector("#tabelaEnderecos tbody");
  if (!tabela) return;

  const res = await fetch(`${API_BASE}/clients`);
  const clientes = await res.json();

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
        <td><button class="btn-neutral">Editar</button></td>
      `;
      tabela.appendChild(row);
    });
  });
}

/**********************************
 * LISTAR CARTÕES
 **********************************/
async function listarCartoes() {
  const tabela = document.querySelector("#tabelaCartoes tbody");
  if (!tabela) return;

  const res = await fetch(`${API_BASE}/clients`);
  const clientes = await res.json();

  tabela.innerHTML = "";
  clientes.forEach((c) => {
    (c.cards || []).forEach((cartao) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.name}</td>
        <td>${cartao.cardNumber}</td>
        <td>${cartao.cardName}</td>
        <td>${cartao.brand}</td>
        <td>${cartao.securityCode}</td>
        <td>${cartao.isPreferred ? "Sim" : "Não"}</td>
        <td><button class="btn-neutral">Editar</button></td>
      `;
      tabela.appendChild(row);
    });
  });
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

    try {
      // Aqui está fixo para cliente ID=1 (ajuste para cliente logado)
      const res = await fetch(`${API_BASE}/clients/1/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: "Senha@123",
          newPassword: novaSenha,
          newPasswordConfirm: confirmar,
        }),
      });
      if (!res.ok) throw await res.json();
      alert("Senha alterada com sucesso!");
      formSenha.reset();
    } catch (err) {
      alert("Erro: " + (err.message || JSON.stringify(err)));
    }
  });
}

/**********************************
 * INICIALIZAÇÃO AUTOMÁTICA
 **********************************/
document.addEventListener("DOMContentLoaded", () => {
  listarClientes();
  listarEnderecos();
  listarCartoes();
});
