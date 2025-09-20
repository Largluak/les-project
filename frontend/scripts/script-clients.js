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
    inativosElement.textContent = stats.inactiveClients;
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

    // Coletar todos os endereços preenchidos
    let enderecos;
    try {
      enderecos = coletarEnderecos();
    } catch (error) {
      showAlert(error.message, "error");
      return;
    }

    // Validar endereços
    if (enderecos.length === 0) {
      showAlert("Você deve cadastrar pelo menos um endereço!", "error");
      return;
    }

    // Verificar se há pelo menos um endereço de cobrança e um de entrega
    const temCobranca = enderecos.some((endereco) => endereco.isBilling);
    const temEntrega = enderecos.some((endereco) => endereco.isDelivery);

    if (!temCobranca) {
      showAlert("Você deve ter pelo menos um endereço de cobrança!", "error");
      return;
    }

    if (!temEntrega) {
      showAlert("Você deve ter pelo menos um endereço de entrega!", "error");
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
      addresses: enderecos,
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

      const mensagemSucesso = `Cliente cadastrado com sucesso! ${enderecos.length} endereço(s) adicionado(s).`;
      showAlert(mensagemSucesso, "success");
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
          <button class="btn-neutral" onclick="editarCliente(${
            c.id
          })" title="Editar cliente">
            <i class="icon-edit">✏️</i> Editar
          </button>
          <button class="${c.active ? "btn-cancel" : "btn-confirm"}" 
                  onclick="alterarStatusCliente(${c.id}, ${!c.active})"
                  title="${c.active ? "Inativar" : "Ativar"} cliente">
            <i class="icon-status">${c.active ? "⏸️" : "▶️"}</i>
            ${c.active ? "Inativar" : "Ativar"}
          </button>
          <button class="btn-cancel" 
                  onclick="removerCliente(${c.id}, '${c.name.replace(
        /'/g,
        "\\'"
      )}')"
                  title="Remover cliente permanentemente">
            <i class="icon-delete">🗑️</i> Remover
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

// Função para remover cliente
async function removerCliente(clienteId, nomeCliente) {
  // Modal de confirmação personalizado
  const confirmacao = await mostrarModalConfirmacao(
    "Remover Cliente",
    `Tem certeza que deseja remover permanentemente o cliente "${nomeCliente}"?`,
    "Esta ação não pode ser desfeita e todos os dados relacionados (endereços, cartões, transações) serão perdidos.",
    "danger"
  );

  if (!confirmacao) return;

  try {
    const res = await fetch(`${API_BASE}/clients/${clienteId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erro ao remover cliente");
    }

    showAlert(`Cliente "${nomeCliente}" removido com sucesso!`, "success");

    // Recarregar a lista
    if (typeof listarClientes === "function") {
      listarClientes();
    } else {
      filtrarClientes();
    }
  } catch (err) {
    console.error("Erro ao remover cliente:", err);
    showAlert(`Erro ao remover cliente: ${err.message}`, "error");
  }
}

// Modal de confirmação personalizado
function mostrarModalConfirmacao(
  titulo,
  mensagem,
  detalhes = "",
  tipo = "warning"
) {
  return new Promise((resolve) => {
    // Remove modal existente se houver
    const modalExistente = document.getElementById("modalConfirmacao");
    if (modalExistente) {
      modalExistente.remove();
    }

    // Cria o modal
    const modal = document.createElement("div");
    modal.id = "modalConfirmacao";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content modal-confirmacao">
        <div class="modal-header ${tipo}">
          <h3>
            <i class="icon-${tipo}">${tipo === "danger" ? "⚠️" : "❓"}</i>
            ${titulo}
          </h3>
        </div>
        <div class="modal-body">
          <p class="mensagem-principal">${mensagem}</p>
          ${detalhes ? `<p class="detalhes">${detalhes}</p>` : ""}
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick="fecharModalConfirmacao(false)">
            Cancelar
          </button>
          <button type="button" class="btn-danger" onclick="fecharModalConfirmacao(true)">
            ${tipo === "danger" ? "Sim, Remover" : "Confirmar"}
          </button>
        </div>
      </div>
    `;

    // Adiciona ao DOM
    document.body.appendChild(modal);
    modal.style.display = "block";

    // Função para fechar modal
    window.fecharModalConfirmacao = function (resultado) {
      modal.remove();
      resolve(resultado);
    };

    // Fechar com ESC
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        document.removeEventListener("keydown", handleEsc);
        fecharModalConfirmacao(false);
      }
    };
    document.addEventListener("keydown", handleEsc);

    // Fechar clicando fora
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        fecharModalConfirmacao(false);
      }
    });
  });
}

const styles = `
<style>
.acoes-cliente {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.btn-delete {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #ff3838 0%, #ff2929 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #ff3838 0%, #ff2929 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
}

.modal-confirmacao {
  max-width: 500px;
  border-radius: 12px;
  overflow: hidden;
}

.modal-header.danger {
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  color: white;
  padding: 20px 30px;
}

.modal-header.warning {
  background: linear-gradient(135deg, #ffa502 0%, #ff6348 100%);
  color: white;
  padding: 20px 30px;
}

.modal-body {
  padding: 30px;
}

.mensagem-principal {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

.detalhes {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #ff4757;
}

.icon-edit, .icon-status, .icon-delete, .icon-danger, .icon-warning {
  font-size: 14px;
  margin-right: 4px;
}

/* Responsivo */
@media (max-width: 768px) {
  .acoes-cliente {
    flex-direction: column;
    gap: 4px;
  }
  
  .acoes-cliente button {
    width: 100%;
    justify-content: center;
  }
}
</style>
`;

// Adiciona os estilos se ainda não foram adicionados
if (!document.getElementById("estilos-remover-cliente")) {
  const styleElement = document.createElement("div");
  styleElement.id = "estilos-remover-cliente";
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
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
          <button class="btn-neutral" onclick="editarCliente(${
            c.id
          })" title="Editar cliente">
            <i class="icon-edit">✏️</i> Editar
          </button>
          <button class="${c.active ? "btn-cancel" : "btn-confirm"}" 
                  onclick="alterarStatusCliente(${c.id}, ${!c.active})"
                  title="${c.active ? "Inativar" : "Ativar"} cliente">
            <i class="icon-status">${c.active ? "⏸️" : "▶️"}</i>
            ${c.active ? "Inativar" : "Ativar"}
          </button>
          <button class="btn-cancel" 
                  onclick="removerCliente(${c.id}, '${c.name.replace(
        /'/g,
        "\\'"
      )}')"
                  title="Remover cliente permanentemente">
            <i class="icon-delete">🗑️</i> Remover
          </button>
        </td>
      `;
      tabela.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao filtrar:", err);
  }
}

/**********************************
 * FUNÇÃO EDITAR CLIENTE
 **********************************/

// Variável global para controlar qual cliente está sendo editado
let clienteEditandoId = null;

async function editarCliente(clienteId) {
  try {
    // Buscar dados completos do cliente usando sua API
    const res = await fetch(`${API_BASE}/clients/${clienteId}`);
    const cliente = await res.json();

    if (!res.ok) {
      throw new Error(cliente.message || "Erro ao carregar cliente");
    }

    // Preencher o modal com os dados do cliente
    document.getElementById("editNome").value = cliente.name;
    document.getElementById("editEmail").value = cliente.email;

    // Usar sua função formatPhone existente para o telefone
    const telefoneFormatado = formatPhone(
      cliente.phoneDDD || "",
      cliente.phoneNumber || ""
    );
    document.getElementById("editTelefone").value = telefoneFormatado;

    document.getElementById("editRanking").value = cliente.ranking || 0;
    document.getElementById("editStatus").value = cliente.active
      ? "Ativo"
      : "Inativo";

    // Guardar o ID do cliente que está sendo editado
    clienteEditandoId = clienteId;

    // Mostrar o modal
    document.getElementById("modalCliente").style.display = "block";
  } catch (err) {
    console.error("Erro ao carregar dados do cliente:", err);
    showAlert("Erro ao carregar dados do cliente", "error");
  }
}

/**********************************
 * FUNÇÃO PARA FECHAR O MODAL
 **********************************/
function fecharModalCliente() {
  document.getElementById("modalCliente").style.display = "none";
  clienteEditandoId = null;
  document.getElementById("formEditarCliente").reset();
}

/**********************************
 * LISTENER PARA SALVAR AS EDIÇÕES
 **********************************/
const formEditarCliente = document.getElementById("formEditarCliente");
if (formEditarCliente) {
  formEditarCliente.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!clienteEditandoId) {
      showAlert("Erro: Nenhum cliente selecionado para edição", "error");
      return;
    }

    // Processar telefone (mesma lógica que você usa no cadastro)
    const telefoneCompleto = document
      .getElementById("editTelefone")
      .value.replace(/\D/g, "");
    const ddd = telefoneCompleto.substring(0, 2);
    const numero = telefoneCompleto.substring(2);

    const payload = {
      name: document.getElementById("editNome").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      ranking: parseInt(document.getElementById("editRanking").value),
      phone: {
        type: "mobile",
        ddd: ddd,
        number: numero,
      },
    };

    try {
      const res = await fetch(`${API_BASE}/clients/${clienteEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao atualizar cliente");
      }

      showAlert("Cliente atualizado com sucesso!", "success");
      fecharModalCliente();
      listarClientes(); // Usar sua função existente para recarregar a lista
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
      showAlert(`Erro ao atualizar cliente: ${err.message}`, "error");
    }
  });
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

    // ✅ Recarregar dashboard se estivermos na página inicial
    if (typeof carregarDashboard === "function") {
      carregarDashboard();
    }
  } catch (err) {
    console.error("Erro ao alterar status:", err);
    showAlert("Erro ao alterar status do cliente", "error");
  }
}

/**********************************
 * FUNÇÃO PARA CARREGAR CLIENTES NOS SELECTS
 **********************************/
async function carregarClientesSelect() {
  const selectsCliente = document.querySelectorAll("#clienteId");
  if (selectsCliente.length === 0) return;

  try {
    // Busca apenas clientes ativos
    const res = await fetch(`${API_BASE}/clients?active=true`);
    const data = await res.json();
    const clientes = data.clients || data;

    selectsCliente.forEach((select) => {
      // Limpa o select mantendo apenas a primeira opção
      select.innerHTML = '<option value="">Selecione um cliente</option>';

      // Adiciona os clientes como opções
      clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.id;
        option.textContent = `${cliente.name} - ${formatCPF(cliente.cpf)}`;
        select.appendChild(option);
      });
    });
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
    showAlert("Erro ao carregar lista de clientes", "error");
  }
}

/**********************************
 * CADASTRAR ENDEREÇOS
 **********************************/
const formEndereco = document.getElementById("formEndereco");
if (formEndereco) {
  formEndereco.addEventListener("submit", async function (e) {
    e.preventDefault();

    const clienteId = document.getElementById("clienteId").value;

    if (!clienteId) {
      showAlert("Por favor, selecione um cliente!", "error");
      return;
    }

    const payload = {
      name: `${document.getElementById("tipoEndereco").value} - ${
        document.getElementById("logradouro").value
      }`,
      residenceType: document.getElementById("tipoEndereco").value,
      streetType: document.getElementById("tipoLogradouro").value || "Rua",
      street: document.getElementById("logradouro").value,
      number: document.getElementById("numero").value,
      district: document.getElementById("bairro").value,
      cep: document.getElementById("cep").value.replace(/\D/g, ""),
      city: document.getElementById("cidade").value,
      state: document.getElementById("estado").value,
      country: document.getElementById("pais").value || "Brasil",
      observations: document.getElementById("observacoes").value,
      isBilling: document.getElementById("enderecoCobranca")?.checked || false,
      isDelivery: document.getElementById("enderecoEntrega")?.checked || true,
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

// Variáveis globais para controle do modal
let enderecoAtual = {};

// Função para abrir o modal de edição de endereço
async function editarEndereco(clienteId, enderecoId) {
  try {
    // Buscar dados do endereço
    const res = await fetch(`${API_BASE}/clients/${clienteId}`);
    const cliente = await res.json();

    const endereco = cliente.addresses.find((addr) => addr.id === enderecoId);
    if (!endereco) {
      showAlert("Endereço não encontrado!", "error");
      return;
    }

    // Armazenar dados atuais
    enderecoAtual = {
      clienteId: clienteId,
      enderecoId: enderecoId,
      ...endereco,
    };

    // Preencher o formulário do modal
    document.getElementById("editTipo").value = endereco.residenceType || "";
    document.getElementById("editLogradouro").value = endereco.street || "";
    document.getElementById("editNumero").value = endereco.number || "";
    document.getElementById("editBairro").value = endereco.district || "";
    document.getElementById("editCidade").value = endereco.city || "";
    document.getElementById("editCep").value = endereco.cep || "";
    document.getElementById("editEstado").value = endereco.state || "";
    document.getElementById("editPais").value = endereco.country || "";
    document.getElementById("editObservacoes").value =
      endereco.observations || "";

    // Abrir o modal
    document.getElementById("modalEditarEndereco").style.display = "block";
  } catch (err) {
    console.error("Erro ao carregar endereço:", err);
    showAlert("Erro ao carregar dados do endereço", "error");
  }
}

// Função para fechar o modal de endereço
function fecharModal() {
  document.getElementById("modalEditarEndereco").style.display = "none";
  enderecoAtual = {};
}

// Função para salvar alterações do endereço
const formEditarEndereco = document.getElementById("formEditarEndereco");
if (formEditarEndereco) {
  formEditarEndereco.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!enderecoAtual.clienteId || !enderecoAtual.enderecoId) {
      showAlert("Erro: dados do endereço não encontrados", "error");
      return;
    }

    const payload = {
      name: `${document.getElementById("editTipo").value} - ${
        document.getElementById("editLogradouro").value
      }`,
      residenceType: document.getElementById("editTipo").value,
      streetType: enderecoAtual.streetType || "Rua",
      street: document.getElementById("editLogradouro").value,
      number: document.getElementById("editNumero").value,
      district: document.getElementById("editBairro").value,
      cep: document.getElementById("editCep").value.replace(/\D/g, ""),
      city: document.getElementById("editCidade").value,
      state: document.getElementById("editEstado").value,
      country: document.getElementById("editPais").value,
      observations: document.getElementById("editObservacoes").value,
      isBilling: enderecoAtual.isBilling || false,
      isDelivery: enderecoAtual.isDelivery || true,
    };

    try {
      const res = await fetch(
        `${API_BASE}/clients/${enderecoAtual.clienteId}/addresses/${enderecoAtual.enderecoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      showAlert("Endereço atualizado com sucesso!", "success");
      fecharModal();
      listarEnderecos(); // Recarregar a lista
    } catch (err) {
      console.error("Erro ao atualizar endereço:", err);
      showAlert(`Erro ao atualizar endereço: ${err.message}`, "error");
    }
  });
}

// Função para remover endereço
async function removerEndereco(clienteId, enderecoId) {
  if (!confirm("Tem certeza que deseja remover este endereço?")) {
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/clients/${clienteId}/addresses/${enderecoId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    showAlert("Endereço removido com sucesso!", "success");
    listarEnderecos(); // Recarregar a lista
  } catch (err) {
    console.error("Erro ao remover endereço:", err);
    showAlert(`Erro ao remover endereço: ${err.message}`, "error");
  }
}

/**********************************
 * CADASTRAR CARTÕES
 **********************************/
const formCartao = document.getElementById("formCartao");
if (formCartao) {
  formCartao.addEventListener("submit", async function (e) {
    e.preventDefault();

    const clienteId = document.getElementById("clienteId").value;

    if (!clienteId) {
      showAlert("Por favor, selecione um cliente!", "error");
      return;
    }

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

// Variáveis globais para controle do modal de cartão
let cartaoAtual = {};

// Função para abrir o modal de edição de cartão
async function editarCartao(clienteId, cartaoId) {
  try {
    // Buscar dados do cartão
    const res = await fetch(`${API_BASE}/clients/${clienteId}`);
    const cliente = await res.json();

    const cartao = cliente.cards.find((card) => card.id === cartaoId);
    if (!cartao) {
      showAlert("Cartão não encontrado!", "error");
      return;
    }

    // Armazenar dados atuais
    cartaoAtual = {
      clienteId: clienteId,
      cartaoId: cartaoId,
      ...cartao,
    };

    // Preencher o formulário do modal
    document.getElementById("editNumeroCartao").value = cartao.cardNumber || "";
    document.getElementById("editNomeCartao").value = cartao.cardName || "";
    document.getElementById("editBandeiraCartao").value = cartao.brand || "";
    document.getElementById("editCodigoCartao").value =
      cartao.securityCode || "";
    document.getElementById("editPreferencialCartao").value = cartao.isPreferred
      ? "true"
      : "false";

    // Abrir o modal
    document.getElementById("modalCartao").style.display = "block";
  } catch (err) {
    console.error("Erro ao carregar cartão:", err);
    showAlert("Erro ao carregar dados do cartão", "error");
  }
}

// Função para fechar o modal de cartão
function fecharModalCartao() {
  document.getElementById("modalCartao").style.display = "none";
  cartaoAtual = {};
}

// Função para salvar alterações do cartão
const formEditarCartao = document.getElementById("formEditarCartao");
if (formEditarCartao) {
  formEditarCartao.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!cartaoAtual.clienteId || !cartaoAtual.cartaoId) {
      showAlert("Erro: dados do cartão não encontrados", "error");
      return;
    }

    const payload = {
      cardNumber: document
        .getElementById("editNumeroCartao")
        .value.replace(/\D/g, ""),
      cardName: document.getElementById("editNomeCartao").value,
      brand: document.getElementById("editBandeiraCartao").value,
      securityCode: document.getElementById("editCodigoCartao").value,
      isPreferred:
        document.getElementById("editPreferencialCartao").value === "true",
    };

    try {
      const res = await fetch(
        `${API_BASE}/clients/${cartaoAtual.clienteId}/cards/${cartaoAtual.cartaoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      showAlert("Cartão atualizado com sucesso!", "success");
      fecharModalCartao();
      listarCartoes(); // Recarregar a lista
    } catch (err) {
      console.error("Erro ao atualizar cartão:", err);
      showAlert(`Erro ao atualizar cartão: ${err.message}`, "error");
    }
  });
}

// Função para remover cartão
async function removerCartao(cartaoId) {
  if (!confirm("Tem certeza que deseja remover este cartão?")) {
    return;
  }

  try {
    // Buscar o clienteId do cartão
    const resClientes = await fetch(`${API_BASE}/clients`);
    const data = await resClientes.json();
    const clientes = data.clients || data;

    let clienteId = null;
    for (const cliente of clientes) {
      if (cliente.cards && cliente.cards.find((c) => c.id === cartaoId)) {
        clienteId = cliente.id;
        break;
      }
    }

    if (!clienteId) {
      showAlert("Cliente do cartão não encontrado!", "error");
      return;
    }

    const res = await fetch(
      `${API_BASE}/clients/${clienteId}/cards/${cartaoId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message);
    }

    showAlert("Cartão removido com sucesso!", "success");
    listarCartoes(); // Recarregar a lista
  } catch (err) {
    console.error("Erro ao remover cartão:", err);
    showAlert(`Erro ao remover cartão: ${err.message}`, "error");
  }
}

// Fechar modal ao clicar fora dele
window.addEventListener("click", function (event) {
  const modalEndereco = document.getElementById("modalEditarEndereco");
  const modalCartao = document.getElementById("modalCartao");

  if (event.target === modalEndereco) {
    fecharModal();
  }

  if (event.target === modalCartao) {
    fecharModalCartao();
  }
});

/**********************************
 * ALTERAR SENHA COM SELECT DE CLIENTES
 * Substitua a seção de alterar senha no seu script-clients.js por este código
 **********************************/

// Carregar clientes no select quando a página carregar
document.addEventListener("DOMContentLoaded", async function () {
  if (document.getElementById("clienteSelect")) {
    await carregarClientesSelect();
  }
});

/**********************************
 * MOSTRAR INFORMAÇÕES DO CLIENTE SELECIONADO
 **********************************/
const clienteSelect = document.getElementById("clienteSelect");
if (clienteSelect) {
  clienteSelect.addEventListener("change", function () {
    const infoDiv = document.getElementById("infoCliente");
    const selectedOption = this.options[this.selectedIndex];

    if (this.value) {
      // Mostrar informações do cliente selecionado
      document.getElementById("nomeCliente").textContent =
        selectedOption.dataset.nome;
      document.getElementById("emailCliente").textContent =
        selectedOption.dataset.email;
      infoDiv.style.display = "block";
    } else {
      // Esconder informações se nenhum cliente selecionado
      infoDiv.style.display = "none";
    }
  });
}

/**********************************
 * FORM ALTERAR SENHA
 **********************************/
const formSenha = document.getElementById("formSenha");
if (formSenha) {
  formSenha.addEventListener("submit", async function (e) {
    e.preventDefault();

    const clienteId = document.getElementById("clienteId").value;
    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmNovaSenha = document.getElementById("confirmNovaSenha").value;

    // Validações no frontend
    if (!clienteId) {
      showAlert("Por favor, selecione um cliente!", "error");
      return;
    }

    if (novaSenha !== confirmNovaSenha) {
      showAlert("Nova senha e confirmação não coincidem!", "error");
      return;
    }

    if (novaSenha.length < 8) {
      showAlert("Nova senha deve ter pelo menos 8 caracteres!", "error");
      return;
    }

    // Validação de complexidade da senha (mesmo que no validator)
    const temMinuscula = /[a-z]/.test(novaSenha);
    const temMaiuscula = /[A-Z]/.test(novaSenha);
    const temNumero = /[0-9]/.test(novaSenha);
    const temEspecial = /[!@#\$%\^&\*]/.test(novaSenha);

    if (!temMinuscula || !temMaiuscula || !temNumero || !temEspecial) {
      showAlert(
        "Nova senha deve conter: maiúscula, minúscula, número e caractere especial (!@#$%^&*)",
        "error"
      );
      return;
    }

    if (senhaAtual === novaSenha) {
      showAlert("Nova senha deve ser diferente da senha atual!", "error");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/clients/${clienteId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: senhaAtual,
          newPassword: novaSenha,
          newPasswordConfirm: confirmNovaSenha,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro no servidor");
      }

      showAlert("Senha alterada com sucesso!", "success");
      formSenha.reset();

      // Esconder informações do cliente
      document.getElementById("infoCliente").style.display = "none";
    } catch (err) {
      console.error("Erro ao alterar senha:", err);

      // Tratamento específico para diferentes tipos de erro
      if (err.message.includes("Senha atual incorreta")) {
        showAlert("Senha atual está incorreta!", "error");
      } else if (err.message.includes("Validation error")) {
        showAlert(
          "Dados inválidos. Verifique os campos e tente novamente.",
          "error"
        );
      } else if (err.message.includes("Cliente não encontrado")) {
        showAlert("Cliente não encontrado!", "error");
      } else {
        showAlert(`Erro ao alterar senha: ${err.message}`, "error");
      }
    }
  });
}

/**********************************
 * FUNÇÕES PARA MÚLTIPLOS ENDEREÇOS
 **********************************/

// Contador global para endereços
let contadorEnderecos = 1;

// Função para coletar todos os endereços preenchidos
function coletarEnderecos() {
  const enderecos = [];
  const enderecoItems = document.querySelectorAll(".endereco-item");

  enderecoItems.forEach((item, index) => {
    const numero = index + 1;

    // Verificar se pelo menos um campo obrigatório está preenchido
    const logradouro = document
      .getElementById(`logradouro${numero}`)
      ?.value.trim();
    const numeroEndereco = document
      .getElementById(`numero${numero}`)
      ?.value.trim();
    const bairro = document.getElementById(`bairro${numero}`)?.value.trim();
    const cep = document.getElementById(`cep${numero}`)?.value.trim();
    const cidade = document.getElementById(`cidade${numero}`)?.value.trim();
    const estado = document.getElementById(`estado${numero}`)?.value;

    // Se algum campo obrigatório estiver preenchido, todos devem estar
    const camposObrigatorios = [
      logradouro,
      numeroEndereco,
      bairro,
      cep,
      cidade,
      estado,
    ];
    const algumPreenchido = camposObrigatorios.some((valor) => valor !== "");

    if (algumPreenchido) {
      // Verificar se todos os campos obrigatórios estão preenchidos
      const todosPreenchidos = camposObrigatorios.every(
        (valor) => valor !== ""
      );

      if (!todosPreenchidos) {
        throw new Error(
          `Endereço ${numero}: Se você preencher algum campo, todos os campos obrigatórios devem ser preenchidos!`
        );
      }

      // Adicionar endereço à lista
      enderecos.push({
        name: `${
          document.getElementById(`tipoEndereco${numero}`).value
        } - ${logradouro}`,
        residenceType: document.getElementById(`tipoEndereco${numero}`).value,
        streetType:
          document.getElementById(`tipoLogradouro${numero}`).value || "Rua",
        street: logradouro,
        number: numeroEndereco,
        district: bairro,
        cep: cep.replace(/\D/g, ""),
        city: cidade,
        state: estado,
        country: document.getElementById(`pais${numero}`).value || "Brasil",
        observations:
          document.getElementById(`observacoes${numero}`).value || "",
        isBilling:
          document.getElementById(`enderecoCobranca${numero}`)?.checked ||
          false,
        isDelivery:
          document.getElementById(`enderecoEntrega${numero}`)?.checked || false,
      });
    }
  });

  return enderecos;
}

// Função para adicionar novo endereço
function adicionarEndereco() {
  contadorEnderecos++;
  const container = document.getElementById("enderecosContainer");

  const novoEndereco = document.createElement("div");
  novoEndereco.className = "endereco-item";
  novoEndereco.setAttribute("data-endereco", contadorEnderecos);

  novoEndereco.innerHTML = `
    <div class="endereco-header">
      <h4>Endereço ${contadorEnderecos}</h4>
      <button type="button" class="btn-remove-endereco" onclick="removerEndereco(${contadorEnderecos})">
        🗑️ Remover
      </button>
    </div>

    <label for="tipoEndereco${contadorEnderecos}">Tipo de endereço*</label>
    <select id="tipoEndereco${contadorEnderecos}" required>
      <option value="">Selecione</option>
      <option value="Casa">Casa</option>
      <option value="Apartamento">Apartamento</option>
      <option value="Kitnet">Kitnet</option>
      <option value="Sobrado">Sobrado</option>
      <option value="Cobertura">Cobertura</option>
      <option value="Studio">Studio</option>
    </select>

    <label for="tipoLogradouro${contadorEnderecos}">Tipo de logradouro*</label>
    <select id="tipoLogradouro${contadorEnderecos}" required>
      <option value="">Selecione</option>
      <option value="Rua">Rua</option>
      <option value="Avenida">Avenida</option>
      <option value="Travessa">Travessa</option>
      <option value="Alameda">Alameda</option>
      <option value="Praça">Praça</option>
      <option value="Estrada">Estrada</option>
      <option value="Rodovia">Rodovia</option>
    </select>

    <label for="logradouro${contadorEnderecos}">Logradouro*</label>
    <input type="text" id="logradouro${contadorEnderecos}" required />

    <label for="numero${contadorEnderecos}">Número*</label>
    <input type="text" id="numero${contadorEnderecos}" required />

    <label for="bairro${contadorEnderecos}">Bairro*</label>
    <input type="text" id="bairro${contadorEnderecos}" required />

    <label for="cep${contadorEnderecos}">CEP*</label>
    <input type="text" id="cep${contadorEnderecos}" required />

    <label for="cidade${contadorEnderecos}">Cidade*</label>
    <input type="text" id="cidade${contadorEnderecos}" required />

    <label for="estado${contadorEnderecos}">Estado*</label>
    <select id="estado${contadorEnderecos}" required>
      <option value="">Selecione</option>
      <option value="AC">Acre</option>
      <option value="AL">Alagoas</option>
      <option value="AP">Amapá</option>
      <option value="AM">Amazonas</option>
      <option value="BA">Bahia</option>
      <option value="CE">Ceará</option>
      <option value="DF">Distrito Federal</option>
      <option value="ES">Espírito Santo</option>
      <option value="GO">Goiás</option>
      <option value="MA">Maranhão</option>
      <option value="MT">Mato Grosso</option>
      <option value="MS">Mato Grosso do Sul</option>
      <option value="MG">Minas Gerais</option>
      <option value="PA">Pará</option>
      <option value="PB">Paraíba</option>
      <option value="PR">Paraná</option>
      <option value="PE">Pernambuco</option>
      <option value="PI">Piauí</option>
      <option value="RJ">Rio de Janeiro</option>
      <option value="RN">Rio Grande do Norte</option>
      <option value="RS">Rio Grande do Sul</option>
      <option value="RO">Rondônia</option>
      <option value="RR">Roraima</option>
      <option value="SC">Santa Catarina</option>
      <option value="SP">São Paulo</option>
      <option value="SE">Sergipe</option>
      <option value="TO">Tocantins</option>
    </select>

    <label for="pais${contadorEnderecos}">País*</label>
    <input type="text" id="pais${contadorEnderecos}" value="Brasil" required />

    <label for="observacoes${contadorEnderecos}">Complemento</label>
    <input type="text" id="observacoes${contadorEnderecos}" />

    <div class="checkbox-group">
      <label>
        <input type="checkbox" id="enderecoCobranca${contadorEnderecos}" />
        Endereço de cobrança
      </label>
      <label>
        <input type="checkbox" id="enderecoEntrega${contadorEnderecos}" />
        Endereço de entrega
      </label>
    </div>
  `;

  container.appendChild(novoEndereco);

  // Adicionar máscaras para os novos campos
  adicionarMascarasEndereco(contadorEnderecos);

  // Atualizar numeração dos endereços
  atualizarNumeracaoEnderecos();
}

// Função para remover endereço
function removerEndereco(numeroEndereco) {
  const enderecoItem = document.querySelector(
    `[data-endereco="${numeroEndereco}"]`
  );
  if (enderecoItem) {
    enderecoItem.remove();
    atualizarNumeracaoEnderecos();
  }
}

// Função para atualizar numeração dos endereços
function atualizarNumeracaoEnderecos() {
  const enderecoItems = document.querySelectorAll(".endereco-item");
  enderecoItems.forEach((item, index) => {
    const novoNumero = index + 1;
    item.setAttribute("data-endereco", novoNumero);

    // Atualizar título
    const titulo = item.querySelector("h4");
    titulo.textContent = `Endereço ${novoNumero}`;

    // Atualizar onclick do botão remover
    const btnRemover = item.querySelector(".btn-remove-endereco");
    btnRemover.setAttribute("onclick", `removerEndereco(${novoNumero})`);

    // Atualizar IDs dos campos
    const campos = item.querySelectorAll("input, select, label");
    campos.forEach((campo) => {
      if (campo.id) {
        const novoId = campo.id.replace(/\d+$/, novoNumero);
        campo.id = novoId;
      }
      if (campo.getAttribute("for")) {
        const novoFor = campo.getAttribute("for").replace(/\d+$/, novoNumero);
        campo.setAttribute("for", novoFor);
      }
    });
  });

  // Mostrar/esconder botão remover do primeiro endereço
  const primeiroEndereco = document.querySelector(".endereco-item");
  const btnRemoverPrimeiro = primeiroEndereco?.querySelector(
    ".btn-remove-endereco"
  );
  if (btnRemoverPrimeiro) {
    btnRemoverPrimeiro.style.display =
      enderecoItems.length > 1 ? "block" : "none";
  }
}

// Função para adicionar máscaras aos campos de endereço
function adicionarMascarasEndereco(numero) {
  // Máscara para CEP
  const cepInput = document.getElementById(`cep${numero}`);
  if (cepInput) {
    cepInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }
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
  carregarClientesSelect();

  // Event listener para botão de adicionar endereço
  const btnAdicionarEndereco = document.getElementById("btnAdicionarEndereco");
  if (btnAdicionarEndereco) {
    btnAdicionarEndereco.addEventListener("click", adicionarEndereco);
  }

  // Adicionar máscaras para o primeiro endereço
  adicionarMascarasEndereco(1);

  // Máscara para número do cartão
  const numeroCartaoInput = document.getElementById("numeroCartao");
  if (numeroCartaoInput) {
    numeroCartaoInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = value;
    });
  }

  // Máscara para CEP
  const cepInput = document.getElementById("cep");
  if (cepInput) {
    cepInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }

  // Máscara para código de segurança (só números)
  const codigoInput = document.getElementById("codigoSeguranca");
  if (codigoInput) {
    codigoInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "");
    });
  }

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
