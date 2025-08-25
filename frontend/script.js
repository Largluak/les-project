/**********************************
 * MOCK DE CLIENTES
 **********************************/
let clientes = JSON.parse(localStorage.getItem("clientes")) || [
  {
    codigo: "CLI001",
    nome: "João Silva",
    genero: "Masculino",
    nascimento: "1985-06-15",
    cpf: "123.456.789-00",
    telefone: "(11) 98765-4321",
    email: "joao@email.com",
    senha: "Senha@123",
    ranking: 95,
    status: "Ativo",
    enderecos: [
      {
        tipo: "Residencial",
        logradouro: "Rua A",
        numero: "123",
        bairro: "Centro",
        cep: "01000-000",
        cidade: "São Paulo",
        estado: "SP",
        pais: "Brasil",
        observacoes: "Apartamento 101",
      },
    ],
    cartoes: [
      {
        numero: "4111 1111 1111 1111",
        nome: "JOAO SILVA",
        bandeira: "Visa",
        codigo: "123",
        preferencial: true,
      },
    ],
  },
  {
    codigo: "CLI002",
    nome: "Maria Souza",
    genero: "Feminino",
    nascimento: "1990-03-10",
    cpf: "987.654.321-00",
    telefone: "(21) 91234-5678",
    email: "maria@email.com",
    senha: "Senha@123",
    ranking: 88,
    status: "Ativo",
    enderecos: [
      {
        tipo: "Comercial",
        logradouro: "Av. Brasil",
        numero: "500",
        bairro: "Copacabana",
        cep: "22040-002",
        cidade: "Rio de Janeiro",
        estado: "RJ",
        pais: "Brasil",
        observacoes: "Empresa X",
      },
    ],
    cartoes: [
      {
        numero: "5555 5555 5555 4444",
        nome: "MARIA SOUZA",
        bandeira: "MasterCard",
        codigo: "456",
        preferencial: true,
      },
    ],
  },
  {
    codigo: "CLI003",
    nome: "Carlos Pereira",
    genero: "Masculino",
    nascimento: "1978-12-22",
    cpf: "111.222.333-44",
    telefone: "(31) 99888-7777",
    email: "carlos@email.com",
    senha: "Senha@123",
    ranking: 70,
    status: "Inativo",
    enderecos: [
      {
        tipo: "Residencial",
        logradouro: "Rua B",
        numero: "200",
        bairro: "Savassi",
        cep: "30140-110",
        cidade: "Belo Horizonte",
        estado: "MG",
        pais: "Brasil",
        observacoes: "Casa amarela",
      },
    ],
    cartoes: [
      {
        numero: "3782 8224 6310 005",
        nome: "CARLOS PEREIRA",
        bandeira: "Amex",
        codigo: "789",
        preferencial: true,
      },
    ],
  },
  {
    codigo: "CLI004",
    nome: "Ana Lima",
    genero: "Feminino",
    nascimento: "1995-09-05",
    cpf: "555.666.777-88",
    telefone: "(41) 91234-5678",
    email: "ana@email.com",
    senha: "Senha@123",
    ranking: 92,
    status: "Ativo",
    enderecos: [
      {
        tipo: "Residencial",
        logradouro: "Rua C",
        numero: "350",
        bairro: "Batel",
        cep: "80420-000",
        cidade: "Curitiba",
        estado: "PR",
        pais: "Brasil",
        observacoes: "Casa com jardim",
      },
    ],
    cartoes: [
      {
        numero: "6011 1111 1111 1114",
        nome: "ANA LIMA",
        bandeira: "Discover",
        codigo: "321",
        preferencial: true,
      },
    ],
  },
  {
    codigo: "CLI005",
    nome: "Bruno Alves",
    genero: "Masculino",
    nascimento: "1982-07-30",
    cpf: "999.888.777-66",
    telefone: "(51) 99876-5432",
    email: "bruno@email.com",
    senha: "Senha@123",
    ranking: 65,
    status: "Ativo",
    enderecos: [
      {
        tipo: "Comercial",
        logradouro: "Av. Borges",
        numero: "1000",
        bairro: "Moinhos",
        cep: "90540-001",
        cidade: "Porto Alegre",
        estado: "RS",
        pais: "Brasil",
        observacoes: "Empresa Y",
      },
    ],
    cartoes: [
      {
        numero: "5105 1051 0510 5100",
        nome: "BRUNO ALVES",
        bandeira: "MasterCard",
        codigo: "654",
        preferencial: true,
      },
    ],
  },
];

/**********************************
 * FUNÇÃO AUXILIAR: SALVAR LOCAL
 **********************************/
function salvarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

/**********************************
 * CADASTRO DE CLIENTE
 **********************************/
const formCliente = document.getElementById("formCadastrarCliente");
if (formCliente) {
  formCliente.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const genero = document.getElementById("genero").value;
    const nascimento = document.getElementById("nascimento").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    // Validação de senha forte
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaForte.test(senha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais."
      );
      return;
    }
    if (senha !== confirmarSenha) {
      alert("Senhas não conferem.");
      return;
    }

    // Gerar código único
    const codigo = "CLI" + String(clientes.length + 1).padStart(3, "0");
    const ranking = Math.floor(Math.random() * 100) + 1; // ranking mockado

    clientes.push({
      codigo,
      nome,
      genero,
      nascimento,
      cpf,
      telefone,
      email,
      senha,
      ranking,
      status: "Ativo",
      enderecos: [],
      cartoes: [],
    });

    salvarClientes();
    alert("Cliente cadastrado com sucesso!");
    formCliente.reset();
  });
}

/**********************************
 * LISTAGEM DE CLIENTES
 **********************************/
function listarClientes() {
  const tabela = document.querySelector("#tabelaClientes tbody");
  if (!tabela) return;

  tabela.innerHTML = "";

  // mapeia para manter o índice original e ordena pelo menor ranking
  const ordenados = clientes
    .map((c, idx) => ({ c, idx }))
    .sort((a, b) => a.c.ranking - b.c.ranking);

  ordenados.forEach(({ c, idx }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.telefone}</td>
      <td>${c.ranking}</td>
      <td>${c.status}</td>
      <td>
        <button class="btn-neutral" onclick="editarCliente(${idx})">Editar</button>
        <button class="${
          c.status === "Ativo" ? "btn-cancel" : "btn-confirm"
        }" onclick="inativarCliente(${idx})">
          ${c.status === "Ativo" ? "Inativar" : "Ativar"}
        </button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

//uso também para abrir modal de edição do cartão
let indiceClienteAtual = null;

function editarCliente(i) {
  indiceClienteAtual = i;
  const c = clientes[i];
  document.getElementById("editNome").value = c.nome;
  document.getElementById("editEmail").value = c.email;
  document.getElementById("editTelefone").value = c.telefone;
  document.getElementById("editRanking").value = c.ranking;
  document.getElementById("editStatus").value = c.status;
  document.getElementById("modalCliente").style.display = "block";
}

function fecharModalCliente() {
  document.getElementById("modalCliente").style.display = "none";
}

document
  .getElementById("formEditarCliente")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const c = clientes[indiceClienteAtual];
    c.nome = document.getElementById("editNome").value;
    c.email = document.getElementById("editEmail").value;
    c.telefone = document.getElementById("editTelefone").value;
    c.ranking = document.getElementById("editRanking").value;
    c.status = document.getElementById("editStatus").value;
    salvarClientes();
    carregarClientes();
    fecharModalCliente();
  });

/**********************************
 * FILTRAGEM DE CLIENTES
 **********************************/
function filtrarClientes() {
  const filtroNome = document.getElementById("filtroNome").value.toLowerCase();
  const filtroEmail = document
    .getElementById("filtroEmail")
    .value.toLowerCase();
  const tabela = document.querySelector("#tabelaClientes tbody");

  tabela.innerHTML = "";
  clientes.forEach((c, index) => {
    if (
      c.nome.toLowerCase().includes(filtroNome) &&
      c.email.toLowerCase().includes(filtroEmail)
    ) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c.nome}</td>
        <td>${c.email}</td>
        <td>${c.telefone}</td>
        <td>${c.ranking}</td>
        <td>${c.status}</td>
        <td>
          <button class="btn-neutral" onclick="editarCliente(${index})">Editar</button>
          <button class="btn-cancel" onclick="inativarCliente(${index})">${
        c.status === "Ativo" ? "Inativar" : "Ativar"
      }</button>
        </td>
      `;
      tabela.appendChild(row);
    }
  });
}

function inativarCliente(index) {
  clientes[index].status =
    clientes[index].status === "Ativo" ? "Inativo" : "Ativo";
  salvarClientes();
  listarClientes();
}

/**********************************
 * ENDEREÇOS
 **********************************/
const formEndereco = document.getElementById("formEndereco");
if (formEndereco) {
  formEndereco.addEventListener("submit", function (e) {
    e.preventDefault();
    const tipo = document.getElementById("tipoEndereco").value;
    const logradouro = document.getElementById("logradouro").value;
    const numero = document.getElementById("numero").value;
    const bairro = document.getElementById("bairro").value;
    const cep = document.getElementById("cep").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;
    const pais = document.getElementById("pais").value;
    const observacoes = document.getElementById("observacoes").value;

    // Mock: adicionando ao primeiro cliente
    if (!clientes[0].enderecos) clientes[0].enderecos = [];
    clientes[0].enderecos.push({
      tipo,
      logradouro,
      numero,
      bairro,
      cep,
      cidade,
      estado,
      pais,
      observacoes,
    });
    salvarClientes();
    alert("Endereço adicionado!");
    formEndereco.reset();
    listarEnderecos();
  });
}

function listarEnderecos() {
  const tabela = document.querySelector("#tabelaEnderecos tbody");
  if (!tabela) return;

  tabela.innerHTML = "";
  clientes.forEach((cliente, iCLiente) => {
    cliente.enderecos.forEach((e, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${e.tipo}</td>
        <td>${e.logradouro}</td>
        <td>${e.numero}</td>
        <td>${e.bairro}</td>
        <td>${e.cidade}</td>
        <td>${e.cep}</td>
        <td>${e.estado}</td>
        <td>${e.pais}</td>
        <td>${e.observacoes}</td>
        <td>
          <button class='btn-neutral' onclick="editarEndereco(${iCLiente}, ${index})">Editar</button>
          <button class='btn-cancel' onclick="removerEndereco(${iCLiente}, ${index})">Remover</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  });
}

// Abrir modal com dados do endereço
function editarEndereco(iCliente, index) {
  const endereco = clientes[iCliente].enderecos[index];

  document.getElementById("clienteIndex").value = iCliente;
  document.getElementById("enderecoIndex").value = index;

  document.getElementById("editTipo").value = endereco.tipo;
  document.getElementById("editLogradouro").value = endereco.logradouro;
  document.getElementById("editNumero").value = endereco.numero;
  document.getElementById("editBairro").value = endereco.bairro;
  document.getElementById("editCidade").value = endereco.cidade;
  document.getElementById("editCep").value = endereco.cep;
  document.getElementById("editEstado").value = endereco.estado;
  document.getElementById("editPais").value = endereco.pais;
  document.getElementById("editObservacoes").value = endereco.observacoes || "";

  document.getElementById("modalEditarEndereco").style.display = "block";
}

// Fechar modal
function fecharModal() {
  document.getElementById("modalEditarEndereco").style.display = "none";
}

// Salvar edição
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEditarEndereco");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const iCliente = document.getElementById("clienteIndex").value;
      const index = document.getElementById("enderecoIndex").value;

      clientes[iCliente].enderecos[index] = {
        tipo: document.getElementById("editTipo").value,
        logradouro: document.getElementById("editLogradouro").value,
        numero: document.getElementById("editNumero").value,
        bairro: document.getElementById("editBairro").value,
        cidade: document.getElementById("editCidade").value,
        cep: document.getElementById("editCep").value,
        estado: document.getElementById("editEstado").value,
        pais: document.getElementById("editPais").value,
        observacoes: document.getElementById("editObservacoes").value,
      };

      salvarClientes();
      listarEnderecos();
      fecharModal();
    });
  }
});

function removerEndereco(iCliente, index) {
  clientes[iCliente].enderecos.splice(index, 1);
  salvarClientes();
  listarEnderecos();
}

/**********************************
 * CARTÕES DE CRÉDITO
 **********************************/
const formCartao = document.getElementById("formCartao");
if (formCartao) {
  formCartao.addEventListener("submit", function (e) {
    e.preventDefault();
    const numero = document.getElementById("numeroCartao").value;
    const nome = document.getElementById("nomeCartao").value;
    const bandeira = document.getElementById("bandeiraCartao").value;
    const codigo = document.getElementById("codigoSeguranca").value;
    const preferencial = document.getElementById("preferencial").checked;

    if (!clientes[0].cartoes) clientes[0].cartoes = [];
    if (preferencial) {
      clientes[0].cartoes.forEach((c) => (c.preferencial = false));
    }

    clientes[0].cartoes.push({ numero, nome, bandeira, codigo, preferencial });
    salvarClientes();
    alert("Cartão adicionado!");
    formCartao.reset();
    listarCartoes();
  });
}

function listarCartoes() {
  const tabela = document.querySelector("#tabelaCartoes tbody");
  if (!tabela) return;

  tabela.innerHTML = "";
  clientes.forEach((cliente, iCliente) => {
    cliente.cartoes.forEach((c, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${c.numero}</td>
        <td>${c.nome}</td>
        <td>${c.bandeira}</td>
        <td>${c.codigo}</td>
        <td>${c.preferencial ? "Sim" : "Não"}</td>
        <td>
          <button class='btn-neutral' onclick="editarCartao(${iCliente}, ${index})">Editar</button>
          <button class='btn-cancel' onclick="removerCartao(${iCliente}, ${index})">Remover</button>
        </td>
      `;
      tabela.appendChild(row);
    });
  });
}

let indiceCartaoAtual = null;

function editarCartao(i, j) {
  indiceClienteAtual = i;
  indiceCartaoAtual = j;
  const cartao = clientes[i].cartoes[j];
  document.getElementById("editNumeroCartao").value = cartao.numero;
  document.getElementById("editNomeCartao").value = cartao.nome;
  document.getElementById("editBandeiraCartao").value = cartao.bandeira;
  document.getElementById("editCodigoCartao").value = cartao.codigo;
  document.getElementById("editPreferencialCartao").value = cartao.preferencial;
  document.getElementById("modalCartao").style.display = "block";
}

function fecharModalCartao() {
  document.getElementById("modalCartao").style.display = "none";
}

document
  .getElementById("formEditarCartao")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    const cliente = clientes[indiceClienteAtual];
    const cartao = cliente.cartoes[indiceCartaoAtual];
    cartao.numero = document.getElementById("editNumeroCartao").value;
    cartao.nome = document.getElementById("editNomeCartao").value;
    cartao.bandeira = document.getElementById("editBandeiraCartao").value;
    cartao.codigo = document.getElementById("editCodigoCartao").value;
    cartao.preferencial =
      document.getElementById("editPreferencialCartao").value === "true";
    salvarClientes();
    carregarCartoes();
    fecharModalCartao();
  });

function removerCartao(iCliente, index) {
  clientes[iCliente].cartoes.splice(index, 1);
  salvarClientes();
  listarCartoes();
}

/**********************************
 * ALTERAR SENHA
 **********************************/
const formSenha = document.getElementById("formSenha");
if (formSenha) {
  formSenha.addEventListener("submit", function (e) {
    e.preventDefault();
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmar = document.getElementById("confirmNovaSenha").value;

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!senhaForte.test(novaSenha)) {
      alert(
        "A senha deve ter no mínimo 8 caracteres, letras maiúsculas e minúsculas, números e caracteres especiais."
      );
      return;
    }
    if (novaSenha !== confirmar) {
      alert("Senhas não conferem.");
      return;
    }

    // Mock: altera senha do primeiro cliente
    clientes[0].senha = novaSenha;
    salvarClientes();
    alert("Senha alterada com sucesso!");
    formSenha.reset();
  });
}

/**********************************
 * DASHBOARD RESUMO
 **********************************/
function atualizarResumo() {
  const total = clientes.length;
  const inativos = clientes.filter((c) => c.status === "Inativo").length;
  const melhor = clientes.reduce(
    (a, b) => (a.ranking < b.ranking ? a : b),
    clientes[0]
  ).nome;

  const totalEl = document.getElementById("totalClientes");
  const inativosEl = document.getElementById("clientesInativos");
  const melhorEl = document.getElementById("melhorCliente");

  if (totalEl) totalEl.textContent = total;
  if (inativosEl) inativosEl.textContent = inativos;
  if (melhorEl) melhorEl.textContent = melhor;
}

/**********************************
 * INICIALIZAÇÃO
 **********************************/
listarClientes();
listarEnderecos();
listarCartoes();
atualizarResumo();
