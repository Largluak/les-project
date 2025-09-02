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

// ==============================
// DADOS MOCKADOS - SISTEMA DE LIVROS
// ==============================

// Arrays para armazenar dados
let livros = [];
let autores = [
  { id: 1, nome: "Machado de Assis" },
  { id: 2, nome: "Clarice Lispector" },
  { id: 3, nome: "José Saramago" },
  { id: 4, nome: "Gabriel García Márquez" },
  { id: 5, nome: "Jorge Amado" },
  { id: 6, nome: "Paulo Coelho" },
  { id: 7, nome: "Lygia Fagundes Telles" },
];

let editoras = [
  { id: 1, nome: "Companhia das Letras" },
  { id: 2, nome: "Record" },
  { id: 3, nome: "Globo Livros" },
  { id: 4, nome: "Editora Rocco" },
  { id: 5, nome: "Planeta" },
  { id: 6, nome: "Sextante" },
];

let categorias = [
  { id: 1, nome: "Ficção" },
  { id: 2, nome: "Romance" },
  { id: 3, nome: "Literatura Brasileira" },
  { id: 4, nome: "Literatura Estrangeira" },
  { id: 5, nome: "Biografia" },
  { id: 6, nome: "História" },
  { id: 7, nome: "Autoajuda" },
  { id: 8, nome: "Fantasia" },
  { id: 9, nome: "Suspense" },
  { id: 10, nome: "Crônicas" },
];

let gruposPrecificacao = [
  { id: 1, nome: "Bestsellers", margemLucro: 40 },
  { id: 2, nome: "Literatura Clássica", margemLucro: 35 },
  { id: 3, nome: "Lançamentos", margemLucro: 50 },
  { id: 4, nome: "Livros Técnicos", margemLucro: 60 },
  { id: 5, nome: "Infantojuvenil", margemLucro: 30 },
];

let motivosInativacao = [
  { id: 1, nome: "DESCONTINUADO" },
  { id: 2, nome: "FORA DE MERCADO" },
  { id: 3, nome: "PROBLEMA DE QUALIDADE" },
  { id: 4, nome: "BAIXA PROCURA" },
  { id: 5, nome: "SUBSTITUÍDO POR NOVA EDIÇÃO" },
];

let motivosAtivacao = [
  { id: 1, nome: "REESTOQUE" },
  { id: 2, nome: "NOVA DEMANDA" },
  { id: 3, nome: "CORREÇÃO DE PROBLEMAS" },
  { id: 4, nome: "DECISÃO COMERCIAL" },
];

// Dados iniciais de livros para demonstração
function inicializarDadosLivros() {
  if (livros.length === 0) {
    livros = [
      {
        id: 1,
        titulo: "Dom Casmurro",
        isbn: "9788535902770",
        autor: 1,
        editora: 1,
        ano: 2008,
        edicao: 1,
        numeroPaginas: 256,
        codigoBarras: "9788535902770",
        categorias: [1, 3],
        grupoPrecificacao: 2,
        altura: 20.8,
        largura: 13.6,
        profundidade: 1.6,
        peso: 280,
        sinopse:
          "Romance clássico da literatura brasileira que narra a história de Bentinho e sua obsessão por Capitu.",
        estoque: 25,
        custoUnitario: 15.0,
        precoVenda: 20.25,
        status: "ativo",
        dataCadastro: "2024-01-15",
        ultimaAlteracao: "2024-01-15",
      },
      {
        id: 2,
        titulo: "A Hora da Estrela",
        isbn: "9788535926125",
        autor: 2,
        editora: 1,
        ano: 2017,
        edicao: 1,
        numeroPaginas: 96,
        codigoBarras: "9788535926125",
        categorias: [1, 3],
        grupoPrecificacao: 2,
        altura: 20.8,
        largura: 13.6,
        profundidade: 0.8,
        peso: 120,
        sinopse:
          "Última obra de Clarice Lispector, conta a história de Macabéa, uma jovem nordestina no Rio de Janeiro.",
        estoque: 0,
        custoUnitario: 12.0,
        precoVenda: 16.2,
        status: "inativo",
        dataCadastro: "2024-01-16",
        ultimaAlteracao: "2024-01-20",
        motivoInativacao: "FORA DE MERCADO",
        justificativaInativacao:
          "Inativado automaticamente por falta de estoque e baixas vendas",
      },
      {
        id: 3,
        titulo: "O Alquimista",
        isbn: "9788535902772",
        autor: 6,
        editora: 4,
        ano: 2014,
        edicao: 2,
        numeroPaginas: 208,
        codigoBarras: "9788535902772",
        categorias: [1, 7],
        grupoPrecificacao: 1,
        altura: 20.8,
        largura: 13.6,
        profundidade: 1.4,
        peso: 230,
        sinopse:
          "A jornada de Santiago, um jovem pastor andaluz, em busca de um tesouro.",
        estoque: 45,
        custoUnitario: 18.0,
        precoVenda: 25.2,
        status: "ativo",
        dataCadastro: "2024-01-10",
        ultimaAlteracao: "2024-01-10",
      },
    ];
  }
}

// Variáveis globais
let paginaAtual = 1;
let itensPorPagina = 10;
let totalItens = 0;
let resultadosFiltrados = [];
let proximoId = 4;

// ==============================
// FUNÇÕES UTILITÁRIAS
// ==============================

function gerarProximoId() {
  return proximoId++;
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function obterNomeAutor(id) {
  const autor = autores.find((a) => a.id === id);
  return autor ? autor.nome : "Não informado";
}

function obterNomeEditora(id) {
  const editora = editoras.find((e) => e.id === id);
  return editora ? editora.nome : "Não informado";
}

function obterNomeCategoria(id) {
  const categoria = categorias.find((c) => c.id === id);
  return categoria ? categoria.nome : "Não informado";
}

function obterNomeGrupoPrecificacao(id) {
  const grupo = gruposPrecificacao.find((g) => g.id === id);
  return grupo ? grupo.nome : "Não informado";
}

function calcularPrecoVenda(custoUnitario, grupoPrecificacaoId) {
  const grupo = gruposPrecificacao.find((g) => g.id === grupoPrecificacaoId);
  if (!grupo || !custoUnitario) return 0;

  const margem = grupo.margemLucro / 100;
  return custoUnitario * (1 + margem);
}

function mostrarAlerta(mensagem, tipo = "info") {
  // Remove alertas existentes
  const alertasExistentes = document.querySelectorAll(".alert");
  alertasExistentes.forEach((alerta) => alerta.remove());

  // Cria novo alerta
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensagem;

  // Insere no início do main
  const main = document.querySelector("main");
  main.insertBefore(alerta, main.firstChild);

  // Remove após 5 segundos
  setTimeout(() => {
    alerta.remove();
  }, 5000);
}

function registrarAtividade(descricao) {
  const agora = new Date();
  const tempo = agora.toLocaleString("pt-BR");

  const listaAtividades = document.getElementById("activityList");
  if (listaAtividades) {
    const novaAtividade = document.createElement("div");
    novaAtividade.className = "activity-item";
    novaAtividade.innerHTML = `
            <span class="activity-time">${tempo}</span>
            <span class="activity-desc">${descricao}</span>
        `;

    // Insere no início da lista
    listaAtividades.insertBefore(novaAtividade, listaAtividades.firstChild);

    // Mantém apenas as 10 últimas atividades
    const atividades = listaAtividades.children;
    if (atividades.length > 10) {
      listaAtividades.removeChild(atividades[atividades.length - 1]);
    }
  }
}

// ==============================
// FUNÇÕES DO DASHBOARD
// ==============================

function atualizarDashboard() {
  inicializarDadosLivros();

  const totalLivros = livros.length;
  const livrosAtivos = livros.filter((l) => l.status === "ativo").length;
  const livrosInativos = livros.filter((l) => l.status === "inativo").length;
  const livrosSemEstoque = livros.filter((l) => l.estoque === 0).length;

  // Atualiza elementos do dashboard se existirem
  const elementoTotal = document.getElementById("totalLivros");
  const elementoAtivos = document.getElementById("livrosAtivos");
  const elementoInativos = document.getElementById("livrosInativos");
  const elementoSemEstoque = document.getElementById("livrosSemEstoque");

  if (elementoTotal) elementoTotal.textContent = totalLivros;
  if (elementoAtivos) elementoAtivos.textContent = livrosAtivos;
  if (elementoInativos) elementoInativos.textContent = livrosInativos;
  if (elementoSemEstoque) elementoSemEstoque.textContent = livrosSemEstoque;
}

function inativarLivrosAutomatico() {
  inicializarDadosLivros();

  let livrosInativados = 0;
  const valorMinimo = 10; // Valor mínimo para inativação automática

  livros.forEach((livro) => {
    if (
      livro.status === "ativo" &&
      livro.estoque === 0 &&
      livro.precoVenda < valorMinimo
    ) {
      livro.status = "inativo";
      livro.motivoInativacao = "FORA DE MERCADO";
      livro.justificativaInativacao =
        "Inativado automaticamente por falta de estoque e baixo valor de venda";
      livro.ultimaAlteracao = new Date().toISOString().split("T")[0];
      livrosInativados++;
    }
  });

  if (livrosInativados > 0) {
    mostrarAlerta(
      `${livrosInativados} livro(s) inativado(s) automaticamente.`,
      "success"
    );
    registrarAtividade(`${livrosInativados} livros inativados automaticamente`);
    atualizarDashboard();
  } else {
    mostrarAlerta(
      "Nenhum livro atende aos critérios para inativação automática.",
      "info"
    );
  }
}

// ==============================
// FUNÇÕES DO FORMULÁRIO DE CADASTRO
// ==============================

function carregarDadosFormulario() {
  inicializarDadosLivros();

  // Carregar autores
  const selectAutor = document.getElementById("autor");
  if (selectAutor) {
    autores.forEach((autor) => {
      const option = document.createElement("option");
      option.value = autor.id;
      option.textContent = autor.nome;
      selectAutor.appendChild(option);
    });
  }

  // Carregar editoras
  const selectEditora = document.getElementById("editora");
  if (selectEditora) {
    editoras.forEach((editora) => {
      const option = document.createElement("option");
      option.value = editora.id;
      option.textContent = editora.nome;
      selectEditora.appendChild(option);
    });
  }

  // Carregar categorias (checkboxes)
  const divCategorias = document.getElementById("categorias");
  if (divCategorias) {
    categorias.forEach((categoria) => {
      const div = document.createElement("div");
      div.className = "checkbox-item";
      div.innerHTML = `
                <input type="checkbox" id="cat_${categoria.id}" name="categorias" value="${categoria.id}">
                <label for="cat_${categoria.id}">${categoria.nome}</label>
            `;
      divCategorias.appendChild(div);
    });
  }

  // Carregar grupos de precificação
  const selectGrupo = document.getElementById("grupoPrecificacao");
  if (selectGrupo) {
    gruposPrecificacao.forEach((grupo) => {
      const option = document.createElement("option");
      option.value = grupo.id;
      option.textContent = `${grupo.nome} (${grupo.margemLucro}%)`;
      selectGrupo.appendChild(option);
    });
  }
}

function configurarEventosFormulario() {
  const form = document.getElementById("formCadastroLivro");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      cadastrarLivro();
    });
  }

  // Evento para calcular preço automaticamente
  const custoUnitario = document.getElementById("custoUnitario");
  const grupoPrecificacao = document.getElementById("grupoPrecificacao");
  const precoVenda = document.getElementById("precoVenda");

  function atualizarPreco() {
    if (custoUnitario && grupoPrecificacao && precoVenda) {
      const custo = parseFloat(custoUnitario.value) || 0;
      const grupoId = parseInt(grupoPrecificacao.value) || 0;

      if (custo > 0 && grupoId > 0) {
        const preco = calcularPrecoVenda(custo, grupoId);
        precoVenda.value = preco.toFixed(2);
      }
    }
  }

  if (custoUnitario) custoUnitario.addEventListener("input", atualizarPreco);
  if (grupoPrecificacao)
    grupoPrecificacao.addEventListener("change", atualizarPreco);
}

function cadastrarLivro() {
  const form = document.getElementById("formCadastroLivro");
  const formData = new FormData(form);

  // Verificar se ISBN já existe
  const isbn = formData.get("isbn");
  if (livros.some((l) => l.isbn === isbn)) {
    mostrarAlerta("ISBN já cadastrado no sistema!", "error");
    return;
  }

  // Obter categorias selecionadas
  const categoriasSelecionadas = [];
  const checkboxesCategorias = document.querySelectorAll(
    'input[name="categorias"]:checked'
  );
  checkboxesCategorias.forEach((checkbox) => {
    categoriasSelecionadas.push(parseInt(checkbox.value));
  });

  if (categoriasSelecionadas.length === 0) {
    mostrarAlerta("Selecione pelo menos uma categoria!", "error");
    return;
  }

  // Criar objeto do livro
  const novoLivro = {
    id: gerarProximoId(),
    titulo: formData.get("titulo"),
    isbn: formData.get("isbn"),
    autor: parseInt(formData.get("autor")),
    editora: parseInt(formData.get("editora")),
    ano: parseInt(formData.get("ano")),
    edicao: parseInt(formData.get("edicao")),
    numeroPaginas: parseInt(formData.get("numeroPaginas")),
    codigoBarras: formData.get("codigoBarras"),
    categorias: categoriasSelecionadas,
    grupoPrecificacao: parseInt(formData.get("grupoPrecificacao")),
    altura: parseFloat(formData.get("altura")),
    largura: parseFloat(formData.get("largura")),
    profundidade: parseFloat(formData.get("profundidade")),
    peso: parseFloat(formData.get("peso")),
    sinopse: formData.get("sinopse"),
    estoque: parseInt(formData.get("estoque")) || 0,
    custoUnitario: parseFloat(formData.get("custoUnitario")) || 0,
    precoVenda: parseFloat(formData.get("precoVenda")) || 0,
    status: "ativo",
    dataCadastro: new Date().toISOString().split("T")[0],
    ultimaAlteracao: new Date().toISOString().split("T")[0],
  };

  // Adicionar à lista
  livros.push(novoLivro);

  mostrarAlerta("Livro cadastrado com sucesso!", "success");
  registrarAtividade(`Livro "${novoLivro.titulo}" cadastrado`);

  // Limpar formulário
  limparFormulario();
}

function limparFormulario() {
  const form = document.getElementById("formCadastroLivro");
  if (form) {
    form.reset();

    // Desmarcar checkboxes de categorias
    const checkboxes = document.querySelectorAll('input[name="categorias"]');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }
}

// ==============================
// FUNÇÕES DE CONSULTA
// ==============================

function carregarFiltrosConsulta() {
  inicializarDadosLivros();

  // Carregar autores no filtro
  const filtroAutor = document.getElementById("filtroAutor");
  if (filtroAutor) {
    autores.forEach((autor) => {
      const option = document.createElement("option");
      option.value = autor.id;
      option.textContent = autor.nome;
      filtroAutor.appendChild(option);
    });
  }

  // Carregar editoras no filtro
  const filtroEditora = document.getElementById("filtroEditora");
  if (filtroEditora) {
    editoras.forEach((editora) => {
      const option = document.createElement("option");
      option.value = editora.id;
      option.textContent = editora.nome;
      filtroEditora.appendChild(option);
    });
  }

  // Carregar categorias no filtro
  const filtroCategoria = document.getElementById("filtroCategoria");
  if (filtroCategoria) {
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.nome;
      filtroCategoria.appendChild(option);
    });
  }
}

function configurarEventosConsulta() {
  const formFiltros = document.getElementById("formFiltros");
  if (formFiltros) {
    formFiltros.addEventListener("submit", function (e) {
      e.preventDefault();
      buscarLivros();
    });
  }
}

function buscarLivros() {
  inicializarDadosLivros();

  const filtros = {
    titulo: document.getElementById("filtroTitulo")?.value.toLowerCase() || "",
    isbn: document.getElementById("filtroIsbn")?.value || "",
    autor: parseInt(document.getElementById("filtroAutor")?.value) || 0,
    editora: parseInt(document.getElementById("filtroEditora")?.value) || 0,
    categoria: parseInt(document.getElementById("filtroCategoria")?.value) || 0,
    status: document.getElementById("filtroStatus")?.value || "",
    anoInicio: parseInt(document.getElementById("filtroAnoInicio")?.value) || 0,
    anoFim: parseInt(document.getElementById("filtroAnoFim")?.value) || 0,
  };

  // Aplicar filtros
  resultadosFiltrados = livros.filter((livro) => {
    let passa = true;

    if (
      filtros.titulo &&
      !livro.titulo.toLowerCase().includes(filtros.titulo)
    ) {
      passa = false;
    }

    if (filtros.isbn && !livro.isbn.includes(filtros.isbn)) {
      passa = false;
    }

    if (filtros.autor && livro.autor !== filtros.autor) {
      passa = false;
    }

    if (filtros.editora && livro.editora !== filtros.editora) {
      passa = false;
    }

    if (filtros.categoria && !livro.categorias.includes(filtros.categoria)) {
      passa = false;
    }

    if (filtros.status && livro.status !== filtros.status) {
      passa = false;
    }

    if (filtros.anoInicio && livro.ano < filtros.anoInicio) {
      passa = false;
    }

    if (filtros.anoFim && livro.ano > filtros.anoFim) {
      passa = false;
    }

    return passa;
  });

  totalItens = resultadosFiltrados.length;
  paginaAtual = 1;

  exibirResultados();
  criarPaginacao();
}

function exibirResultados() {
  const corpoTabela = document.getElementById("corpoTabelaLivros");
  const totalResultados = document.getElementById("totalResultados");

  if (!corpoTabela) return;

  // Atualizar contador
  if (totalResultados) {
    totalResultados.textContent = `${totalItens} livro(s) encontrado(s)`;
  }

  // Limpar tabela
  corpoTabela.innerHTML = "";

  if (totalItens === 0) {
    corpoTabela.innerHTML =
      '<tr class="sem-resultados"><td colspan="10">Nenhum livro encontrado</td></tr>';
    return;
  }

  // Calcular índices da paginação
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = resultadosFiltrados.slice(inicio, fim);

  // Preencher tabela
  itensPagina.forEach((livro) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${obterNomeAutor(livro.autor)}</td>
            <td>${livro.isbn}</td>
            <td>${obterNomeEditora(livro.editora)}</td>
            <td>${livro.ano}</td>
            <td><span class="status-${
              livro.status
            }">${livro.status.toUpperCase()}</span></td>
            <td>${livro.estoque}</td>
            <td>${formatarMoeda(livro.precoVenda)}</td>
            <td class="acoes-tabela">
                <button class="btn-small btn-info" onclick="verDetalhes(${
                  livro.id
                })">Ver</button>
                <button class="btn-small btn-warning" onclick="editarLivro(${
                  livro.id
                })">Editar</button>
                ${
                  livro.status === "ativo"
                    ? `<button class="btn-small btn-danger" onclick="inativarLivro(${livro.id})">Inativar</button>`
                    : `<button class="btn-small btn-success" onclick="ativarLivro(${livro.id})">Ativar</button>`
                }
            </td>
        `;
    corpoTabela.appendChild(linha);
  });
}

function criarPaginacao() {
  const paginacao = document.getElementById("paginacao");
  if (!paginacao) return;

  const totalPaginas = Math.ceil(totalItens / itensPorPagina);

  if (totalPaginas <= 1) {
    paginacao.innerHTML = "";
    return;
  }

  let html = "";

  // Botão anterior
  html += `<button ${
    paginaAtual === 1 ? "disabled" : ""
  } onclick="irParaPagina(${paginaAtual - 1})">Anterior</button>`;

  // Números das páginas
  for (let i = 1; i <= totalPaginas; i++) {
    if (
      i === paginaAtual ||
      i === 1 ||
      i === totalPaginas ||
      (i >= paginaAtual - 1 && i <= paginaAtual + 1)
    ) {
      html += `<button class="${
        i === paginaAtual ? "ativo" : ""
      }" onclick="irParaPagina(${i})">${i}</button>`;
    } else if (i === paginaAtual - 2 || i === paginaAtual + 2) {
      html += "<span>...</span>";
    }
  }

  // Botão próximo
  html += `<button ${
    paginaAtual === totalPaginas ? "disabled" : ""
  } onclick="irParaPagina(${paginaAtual + 1})">Próximo</button>`;

  paginacao.innerHTML = html;
}

function irParaPagina(pagina) {
  paginaAtual = pagina;
  exibirResultados();
  criarPaginacao();
}

function limparFiltros() {
  const form = document.getElementById("formFiltros");
  if (form) {
    form.reset();
    buscarLivros();
  }
}

function exportarResultados() {
  if (resultadosFiltrados.length === 0) {
    mostrarAlerta("Nenhum resultado para exportar!", "warning");
    return;
  }

  let csv = "ID,Título,Autor,ISBN,Editora,Ano,Status,Estoque,Preço\n";

  resultadosFiltrados.forEach((livro) => {
    csv += `${livro.id},"${livro.titulo}","${obterNomeAutor(livro.autor)}","${
      livro.isbn
    }","${obterNomeEditora(livro.editora)}",${livro.ano},${livro.status},${
      livro.estoque
    },${livro.precoVenda}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "livros_" + new Date().toISOString().split("T")[0] + ".csv";
  a.click();
  window.URL.revokeObjectURL(url);

  registrarAtividade(
    `Exportados ${resultadosFiltrados.length} livros para CSV`
  );
}

// ==============================
// FUNÇÕES DE DETALHES E EDIÇÃO
// ==============================

function verDetalhes(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  const categoriesNames = livro.categorias
    .map((catId) => obterNomeCategoria(catId))
    .join(", ");

  const detalhesHtml = `
        <div class="detalhes-grid">
            <div class="detalhe-item">
                <div class="detalhe-label">Título</div>
                <div class="detalhe-valor">${livro.titulo}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">ISBN</div>
                <div class="detalhe-valor">${livro.isbn}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Autor</div>
                <div class="detalhe-valor">${obterNomeAutor(livro.autor)}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Editora</div>
                <div class="detalhe-valor">${obterNomeEditora(
                  livro.editora
                )}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Ano</div>
                <div class="detalhe-valor">${livro.ano}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Edição</div>
                <div class="detalhe-valor">${livro.edicao}ª</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Páginas</div>
                <div class="detalhe-valor">${livro.numeroPaginas}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Código de Barras</div>
                <div class="detalhe-valor">${livro.codigoBarras}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Categorias</div>
                <div class="detalhe-valor">${categoriesNames}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Grupo Precificação</div>
                <div class="detalhe-valor">${obterNomeGrupoPrecificacao(
                  livro.grupoPrecificacao
                )}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Dimensões</div>
                <div class="detalhe-valor">${livro.altura} x ${
    livro.largura
  } x ${livro.profundidade} cm</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Peso</div>
                <div class="detalhe-valor">${livro.peso}g</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Estoque</div>
                <div class="detalhe-valor">${livro.estoque}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Custo Unitário</div>
                <div class="detalhe-valor">${formatarMoeda(
                  livro.custoUnitario
                )}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Preço de Venda</div>
                <div class="detalhe-valor">${formatarMoeda(
                  livro.precoVenda
                )}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Status</div>
                <div class="detalhe-valor"><span class="status-${
                  livro.status
                }">${livro.status.toUpperCase()}</span></div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Data Cadastro</div>
                <div class="detalhe-valor">${formatarData(
                  livro.dataCadastro
                )}</div>
            </div>
            <div class="detalhe-item">
                <div class="detalhe-label">Última Alteração</div>
                <div class="detalhe-valor">${formatarData(
                  livro.ultimaAlteracao
                )}</div>
            </div>
        </div>
        <div class="sinopse-completa">
            <div class="detalhe-label">Sinopse</div>
            <div class="detalhe-valor">${livro.sinopse}</div>
        </div>
        ${
          livro.motivoInativacao
            ? `
            <div class="sinopse-completa">
                <div class="detalhe-label">Motivo Inativação</div>
                <div class="detalhe-valor">${livro.motivoInativacao}</div>
            </div>
        `
            : ""
        }
        ${
          livro.justificativaInativacao
            ? `
            <div class="sinopse-completa">
                <div class="detalhe-label">Justificativa</div>
                <div class="detalhe-valor">${livro.justificativaInativacao}</div>
            </div>
        `
            : ""
        }
    `;

  document.getElementById("detalhesLivro").innerHTML = detalhesHtml;
  document.getElementById("modalDetalhes").style.display = "block";
}

function editarLivro(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  // Criar formulário de edição
  const formHtml = `
        <input type="hidden" name="id" value="${livro.id}">
        
        <div class="form-section">
            <h3>Informações Básicas</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="editTitulo">Título *</label>
                    <input type="text" id="editTitulo" name="titulo" value="${
                      livro.titulo
                    }" required>
                </div>
                <div class="form-group">
                    <label for="editIsbn">ISBN *</label>
                    <input type="text" id="editIsbn" name="isbn" value="${
                      livro.isbn
                    }" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editAutor">Autor *</label>
                    <select id="editAutor" name="autor" required>
                        <option value="">Selecione um autor</option>
                        ${autores
                          .map(
                            (autor) =>
                              `<option value="${autor.id}" ${
                                autor.id === livro.autor ? "selected" : ""
                              }>${autor.nome}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div class="form-group">
                    <label for="editEditora">Editora *</label>
                    <select id="editEditora" name="editora" required>
                        <option value="">Selecione uma editora</option>
                        ${editoras
                          .map(
                            (editora) =>
                              `<option value="${editora.id}" ${
                                editora.id === livro.editora ? "selected" : ""
                              }>${editora.nome}</option>`
                          )
                          .join("")}
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editAno">Ano *</label>
                    <input type="number" id="editAno" name="ano" value="${
                      livro.ano
                    }" min="1000" max="2025" required>
                </div>
                <div class="form-group">
                    <label for="editEdicao">Edição *</label>
                    <input type="number" id="editEdicao" name="edicao" value="${
                      livro.edicao
                    }" min="1" required>
                </div>
            </div>
        </div>
        
        <div class="form-section">
            <h3>Estoque e Preço</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="editEstoque">Estoque</label>
                    <input type="number" id="editEstoque" name="estoque" value="${
                      livro.estoque
                    }" min="0">
                </div>
                <div class="form-group">
                    <label for="editCustoUnitario">Custo Unitário (R$)</label>
                    <input type="number" id="editCustoUnitario" name="custoUnitario" value="${
                      livro.custoUnitario
                    }" step="0.01" min="0">
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="button" class="btn-secondary" onclick="fecharModalEdicao()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
    `;

  document.getElementById("formEdicaoLivro").innerHTML = formHtml;

  // Configurar evento de submit
  document
    .getElementById("formEdicaoLivro")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      salvarEdicaoLivro();
    });

  document.getElementById("modalEdicao").style.display = "block";
}

function salvarEdicaoLivro() {
  const form = document.getElementById("formEdicaoLivro");
  const formData = new FormData(form);
  const id = parseInt(formData.get("id"));

  const livroIndex = livros.findIndex((l) => l.id === id);
  if (livroIndex === -1) return;

  // Verificar se novo ISBN já existe em outro livro
  const novoIsbn = formData.get("isbn");
  if (livros.some((l) => l.isbn === novoIsbn && l.id !== id)) {
    mostrarAlerta("ISBN já cadastrado no sistema!", "error");
    return;
  }

  // Atualizar dados
  livros[livroIndex] = {
    ...livros[livroIndex],
    titulo: formData.get("titulo"),
    isbn: formData.get("isbn"),
    autor: parseInt(formData.get("autor")),
    editora: parseInt(formData.get("editora")),
    ano: parseInt(formData.get("ano")),
    edicao: parseInt(formData.get("edicao")),
    estoque: parseInt(formData.get("estoque")) || 0,
    custoUnitario: parseFloat(formData.get("custoUnitario")) || 0,
    ultimaAlteracao: new Date().toISOString().split("T")[0],
  };

  // Recalcular preço se necessário
  if (
    livros[livroIndex].custoUnitario > 0 &&
    livros[livroIndex].grupoPrecificacao
  ) {
    livros[livroIndex].precoVenda = calcularPrecoVenda(
      livros[livroIndex].custoUnitario,
      livros[livroIndex].grupoPrecificacao
    );
  }

  mostrarAlerta("Livro atualizado com sucesso!", "success");
  registrarAtividade(`Livro "${livros[livroIndex].titulo}" editado`);

  fecharModalEdicao();
  buscarLivros(); // Atualizar resultados
}

function inativarLivro(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  // Configurar modal para inativação
  document.getElementById("tituloModalStatus").textContent = "Inativar Livro";
  document.getElementById("btnConfirmarStatus").textContent = "Inativar";
  document.getElementById("btnConfirmarStatus").className =
    "btn-primary btn-danger";

  // Carregar motivos de inativação
  const selectMotivo = document.getElementById("motivoStatus");
  selectMotivo.innerHTML = '<option value="">Selecione um motivo</option>';
  motivosInativacao.forEach((motivo) => {
    const option = document.createElement("option");
    option.value = motivo.nome;
    option.textContent = motivo.nome;
    selectMotivo.appendChild(option);
  });

  // Configurar evento de submit
  document.getElementById("formAlterarStatus").onsubmit = function (e) {
    e.preventDefault();
    confirmarInativacao(id);
  };

  document.getElementById("modalStatus").style.display = "block";
}

function ativarLivro(id) {
  const livro = livros.find((l) => l.id === id);
  if (!livro) return;

  // Configurar modal para ativação
  document.getElementById("tituloModalStatus").textContent = "Ativar Livro";
  document.getElementById("btnConfirmarStatus").textContent = "Ativar";
  document.getElementById("btnConfirmarStatus").className =
    "btn-primary btn-success";

  // Carregar motivos de ativação
  const selectMotivo = document.getElementById("motivoStatus");
  selectMotivo.innerHTML = '<option value="">Selecione um motivo</option>';
  motivosAtivacao.forEach((motivo) => {
    const option = document.createElement("option");
    option.value = motivo.nome;
    option.textContent = motivo.nome;
    selectMotivo.appendChild(option);
  });

  // Configurar evento de submit
  document.getElementById("formAlterarStatus").onsubmit = function (e) {
    e.preventDefault();
    confirmarAtivacao(id);
  };

  document.getElementById("modalStatus").style.display = "block";
}

function confirmarInativacao(id) {
  const livroIndex = livros.findIndex((l) => l.id === id);
  if (livroIndex === -1) return;

  const motivo = document.getElementById("motivoStatus").value;
  const justificativa = document.getElementById("justificativaStatus").value;

  if (!motivo || !justificativa.trim()) {
    mostrarAlerta("Preencha todos os campos!", "error");
    return;
  }

  livros[livroIndex].status = "inativo";
  livros[livroIndex].motivoInativacao = motivo;
  livros[livroIndex].justificativaInativacao = justificativa;
  livros[livroIndex].ultimaAlteracao = new Date().toISOString().split("T")[0];

  mostrarAlerta("Livro inativado com sucesso!", "success");
  registrarAtividade(`Livro "${livros[livroIndex].titulo}" inativado`);

  fecharModalStatus();
  buscarLivros();
  atualizarDashboard();
}

function confirmarAtivacao(id) {
  const livroIndex = livros.findIndex((l) => l.id === id);
  if (livroIndex === -1) return;

  const motivo = document.getElementById("motivoStatus").value;
  const justificativa = document.getElementById("justificativaStatus").value;

  if (!motivo || !justificativa.trim()) {
    mostrarAlerta("Preencha todos os campos!", "error");
    return;
  }

  livros[livroIndex].status = "ativo";
  livros[livroIndex].motivoAtivacao = motivo;
  livros[livroIndex].justificativaAtivacao = justificativa;
  livros[livroIndex].ultimaAlteracao = new Date().toISOString().split("T")[0];

  // Remover dados de inativação
  delete livros[livroIndex].motivoInativacao;
  delete livros[livroIndex].justificativaInativacao;

  mostrarAlerta("Livro ativado com sucesso!", "success");
  registrarAtividade(`Livro "${livros[livroIndex].titulo}" ativado`);

  fecharModalStatus();
  buscarLivros();
  atualizarDashboard();
}

// ==============================
// FUNÇÕES DE MODAL
// ==============================

function fecharModal() {
  document.getElementById("modalDetalhes").style.display = "none";
}

function fecharModalEdicao() {
  document.getElementById("modalEdicao").style.display = "none";
}

function fecharModalStatus() {
  document.getElementById("modalStatus").style.display = "none";
  document.getElementById("formAlterarStatus").reset();
}

// Fechar modais clicando fora
window.onclick = function (event) {
  const modais = ["modalDetalhes", "modalEdicao", "modalStatus"];
  modais.forEach((modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// ==============================
// INICIALIZAÇÃO
// ==============================

// Inicializar dados quando a página carregar
document.addEventListener("DOMContentLoaded", function () {
  inicializarDadosLivros();

  // Se estiver na página do dashboard, atualizar
  if (document.getElementById("totalLivros")) {
    atualizarDashboard();
  }
});

// ================================================
// MOCK DE DADOS - SISTEMA DE VENDAS
// ================================================

// Dados dos produtos
// Mock de produtos - Livros
const produtos = [
  {
    id: 1,
    nome: "Dom Casmurro",
    preco: 39.9,
    categoria: "Romance",
    estoque: 20,
    imagem: "dom-casmurro.jpg",
  },
  {
    id: 2,
    nome: "O Senhor dos Anéis - A Sociedade do Anel",
    preco: 59.9,
    categoria: "Fantasia",
    estoque: 15,
    imagem: "senhor-dos-aneis.jpg",
  },
  {
    id: 3,
    nome: "Harry Potter e a Pedra Filosofal",
    preco: 44.9,
    categoria: "Fantasia",
    estoque: 25,
    imagem: "harry-potter.jpg",
  },
  {
    id: 4,
    nome: "Clean Code",
    preco: 119.9,
    categoria: "Tecnologia",
    estoque: 10,
    imagem: "clean-code.jpg",
  },
  {
    id: 5,
    nome: "O Pequeno Príncipe",
    preco: 29.9,
    categoria: "Infantil",
    estoque: 30,
    imagem: "pequeno-principe.jpg",
  },
  {
    id: 6,
    nome: "A Arte da Guerra",
    preco: 34.9,
    categoria: "Estratégia",
    estoque: 18,
    imagem: "arte-da-guerra.jpg",
  },
];

// Dados do carrinho
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// salvar carrinho
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Dados dos pedidos
let pedidos = [
  {
    id: 2001,
    data: "2024-02-01",
    status: "ENTREGUE",
    itens: [{ produtoId: 1, nome: "Dom Casmurro", quantidade: 1, preco: 39.9 }],
    total: 44.89,
    frete: 4.99,
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    pagamento: "Cartão **** 1234",
  },
  {
    id: 2002,
    data: "2024-02-05",
    status: "EM_TRANSITO",
    itens: [
      {
        produtoId: 2,
        nome: "O Senhor dos Anéis - A Sociedade do Anel",
        quantidade: 1,
        preco: 59.9,
      },
      { produtoId: 5, nome: "O Pequeno Príncipe", quantidade: 1, preco: 29.9 },
    ],
    total: 94.79,
    frete: 4.99,
    endereco: "Av. Paulista, 456 - São Paulo, SP",
    pagamento: "Cartão **** 5678",
  },
  {
    id: 2003,
    data: "2024-02-10",
    status: "EM_PROCESSAMENTO",
    itens: [{ produtoId: 4, nome: "Clean Code", quantidade: 1, preco: 119.9 }],
    total: 124.89,
    frete: 4.99,
    endereco: "Rua Augusta, 789 - São Paulo, SP",
    pagamento: "Cartão **** 9012",
  },
  {
    id: 2004,
    data: "2024-02-12",
    status: "EM_TROCA",
    itens: [
      {
        produtoId: 6,
        nome: "A Revolução dos Bichos",
        quantidade: 1,
        preco: 34.9,
      },
    ],
    total: 39.89,
    frete: 4.99,
    endereco: "Rua XV de Novembro, 321 - Curitiba, PR",
    pagamento: "Boleto",
  },
  {
    id: 2005,
    data: "2024-02-15",
    status: "TROCA_AUTORIZADA",
    itens: [{ produtoId: 7, nome: "1984", quantidade: 1, preco: 45.0 }],
    total: 49.99,
    frete: 4.99,
    endereco: "Av. Brasil, 789 - Rio de Janeiro, RJ",
    pagamento: "Pix",
  },
];

// Dados dos endereços
const enderecos = [
  {
    id: 1,
    nome: "Casa",
    rua: "Rua das Flores, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    cep: "01000-000",
  },
  {
    id: 2,
    nome: "Trabalho",
    rua: "Av. Paulista, 456",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    cep: "01310-000",
  },
];

// Dados dos cartões
const cartoes = [
  {
    id: 1,
    nome: "Cartão Principal",
    numero: "**** **** **** 1234",
    bandeira: "Visa",
  },
  {
    id: 2,
    nome: "Cartão Secundário",
    numero: "**** **** **** 5678",
    bandeira: "Mastercard",
  },
];

// Dados dos cupons
const cupons = [
  { codigo: "DESCONTO10", tipo: "promocional", valor: 50.0, valido: true },
  { codigo: "TROCA001", tipo: "troca", valor: 100.0, valido: true },
  { codigo: "PROMO2024", tipo: "promocional", valor: 25.0, valido: true },
];

// Configurações do sistema
const configuracoes = {
  tempoLimiteCarrinho: 30, // minutos
  valorMinimoCartao: 10.0,
  freteGratis: 200.0,
};

// ============================== FUNÇÕES UTILITÁRIAS ==============================

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

function obterStatusTexto(status) {
  const statusMap = {
    EM_PROCESSAMENTO: "Em Processamento",
    APROVADA: "Aprovada",
    EM_TRANSITO: "Em Trânsito",
    ENTREGUE: "Entregue",
    EM_TROCA: "Em Troca",
    TROCA_AUTORIZADA: "Troca Autorizada",
    TROCADO: "Trocado",
    REPROVADA: "Reprovada",
  };
  return statusMap[status] || status;
}

function mostrarAlerta(mensagem, tipo = "info") {
  const alerta = document.createElement("div");
  alerta.className = `alerta alerta-${tipo}`;
  alerta.textContent = mensagem;

  const main = document.querySelector("main");
  main.insertBefore(alerta, main.firstChild);

  setTimeout(() => {
    alerta.remove();
  }, 5000);
}

function validarEstoque(produtoId, quantidade) {
  const produto = produtos.find((p) => p.id === produtoId);
  return produto && produto.estoque >= quantidade;
}

function atualizarEstoque(produtoId, quantidade, operacao = "subtrair") {
  const produto = produtos.find((p) => p.id === produtoId);
  if (produto) {
    if (operacao === "subtrair") {
      produto.estoque -= quantidade;
    } else {
      produto.estoque += quantidade;
    }
  }
}

// ============================== FUNÇÕES DO CARRINHO ==============================

function adicionarAoCarrinho(produtoId, quantidade = 1) {
  if (!validarEstoque(produtoId, quantidade)) {
    mostrarAlerta("Estoque insuficiente para este produto!", "erro");
    return false;
  }

  const produto = produtos.find((p) => p.id === produtoId);
  const itemExistente = carrinho.find((item) => item.produtoId === produtoId);

  if (itemExistente) {
    if (!validarEstoque(produtoId, itemExistente.quantidade + quantidade)) {
      mostrarAlerta(
        "Quantidade solicitada excede o estoque disponível!",
        "erro"
      );
      return false;
    }
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({
      produtoId: produtoId,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: quantidade,
      dataAdicao: new Date(),
      bloqueado: true,
    });
    salvarCarrinho();
  }

  // Bloquear estoque temporariamente
  atualizarEstoque(produtoId, quantidade, "subtrair");

  atualizarContadorCarrinho();
  mostrarAlerta("Produto adicionado ao carrinho!", "sucesso");

  // Iniciar timer para remoção automática (simulado)
  iniciarTimerCarrinho(produtoId);

  return true;
}

function removerDoCarrinho(produtoId) {
  const itemIndex = carrinho.findIndex((item) => item.produtoId === produtoId);
  if (itemIndex !== -1) {
    const item = carrinho[itemIndex];

    // Devolver ao estoque
    atualizarEstoque(produtoId, item.quantidade, "adicionar");

    carrinho.splice(itemIndex, 1);
    atualizarContadorCarrinho();
    salvarCarrinho();

    if (document.getElementById("itens-carrinho")) {
      carregarCarrinho();
    }

    mostrarAlerta("Item removido do carrinho!", "info");
  }
}

function alterarQuantidadeCarrinho(produtoId, novaQuantidade) {
  const item = carrinho.find((item) => item.produtoId === produtoId);
  if (item && novaQuantidade > 0) {
    const diferenca = novaQuantidade - item.quantidade;

    if (!validarEstoque(produtoId, diferenca > 0 ? diferenca : 0)) {
      mostrarAlerta("Estoque insuficiente!", "erro");
      return false;
    }

    // Ajustar estoque
    if (diferenca > 0) {
      atualizarEstoque(produtoId, diferenca, "subtrair");
    } else {
      atualizarEstoque(produtoId, Math.abs(diferenca), "adicionar");
    }

    item.quantidade = novaQuantidade;
    atualizarContadorCarrinho();
    salvarCarrinho();
    carregarCarrinho();
    return true;
  }
  return false;
}

function calcularSubtotal() {
  return carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
}

function atualizarContadorCarrinho() {
  const contador = carrinho.reduce((total, item) => total + item.quantidade, 0);
  const elementos = document.querySelectorAll("#contador-carrinho");
  elementos.forEach((el) => (el.textContent = contador));
}

function iniciarTimerCarrinho(produtoId) {
  // Simulação do timer - em um sistema real, isso seria gerenciado pelo backend
  setTimeout(() => {
    const item = carrinho.find((item) => item.produtoId === produtoId);
    if (item && item.bloqueado) {
      mostrarAlerta("Item removido do carrinho por tempo limite!", "aviso");
      removerDoCarrinho(produtoId);
    }
  }, configuracoes.tempoLimiteCarrinho * 60 * 1000);
}

// ============================== FUNÇÕES DE PRODUTOS ==============================

function carregarProdutos() {
  const container = document.getElementById("lista-produtos");
  if (!container) return;

  container.innerHTML = "";

  produtos.forEach((produto) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.className = "produto-card";

    produtoDiv.innerHTML = `
            <div class="produto-imagem">Imagem</div>
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-preco">${formatarMoeda(produto.preco)}</div>
            <div class="produto-estoque">Estoque: ${produto.estoque}</div>
            <div class="produto-acoes">
                <input type="number" class="quantidade-input" min="1" max="${
                  produto.estoque
                }" value="1" id="qtd-${produto.id}">
                <button class="btn btn-primary" onclick="adicionarProdutoCarrinho(${
                  produto.id
                })" ${produto.estoque === 0 ? "disabled" : ""}>
                    ${produto.estoque === 0 ? "Indisponível" : "Adicionar"}
                </button>
            </div>
        `;

    container.appendChild(produtoDiv);
  });
}

function adicionarProdutoCarrinho(produtoId) {
  const quantidadeInput = document.getElementById(`qtd-${produtoId}`);
  const quantidade = parseInt(quantidadeInput.value) || 1;

  if (adicionarAoCarrinho(produtoId, quantidade)) {
    quantidadeInput.value = 1;
  }
}

function filtrarProdutos() {
  const busca = document.getElementById("busca-produto").value.toLowerCase();
  const categoria = document.getElementById("categoria-filtro").value;

  const produtosFiltrados = produtos.filter((produto) => {
    const matchBusca = produto.nome.toLowerCase().includes(busca);
    const matchCategoria = !categoria || produto.categoria === categoria;
    return matchBusca && matchCategoria;
  });

  const container = document.getElementById("lista-produtos");
  container.innerHTML = "";

  produtosFiltrados.forEach((produto) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.className = "produto-card";

    produtoDiv.innerHTML = `
            <div class="produto-imagem">Imagem</div>
            <div class="produto-nome">${produto.nome}</div>
            <div class="produto-preco">${formatarMoeda(produto.preco)}</div>
            <div class="produto-estoque">Estoque: ${produto.estoque}</div>
            <div class="produto-acoes">
                <input type="number" class="quantidade-input" min="1" max="${
                  produto.estoque
                }" value="1" id="qtd-${produto.id}">
                <button class="btn btn-primary" onclick="adicionarProdutoCarrinho(${
                  produto.id
                })" ${produto.estoque === 0 ? "disabled" : ""}>
                    ${produto.estoque === 0 ? "Indisponível" : "Adicionar"}
                </button>
            </div>
        `;

    container.appendChild(produtoDiv);
  });
}

// ============================== FUNÇÕES DO CARRINHO (PÁGINA) ==============================

function carregarCarrinho() {
  const containerItens = document.getElementById("itens-carrinho");
  const carrinhoVazio = document.getElementById("carrinho-vazio");
  const carrinhoConteudo = document.getElementById("carrinho-conteudo");

  if (!containerItens) return;

  if (carrinho.length === 0) {
    carrinhoVazio.style.display = "block";
    carrinhoConteudo.style.display = "none";
    return;
  }

  carrinhoVazio.style.display = "none";
  carrinhoConteudo.style.display = "block";

  containerItens.innerHTML = "";

  carrinho.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item-carrinho";

    itemDiv.innerHTML = `
            <div class="item-imagem">Imagem</div>
            <div class="item-detalhes">
                <div class="item-nome">${item.nome}</div>
                <div class="item-preco">${formatarMoeda(item.preco)}</div>
            </div>
            <div class="item-controles">
                <button class="btn btn-secondary" onclick="alterarQuantidade(${
                  item.produtoId
                }, ${item.quantidade - 1})">-</button>
                <input type="number" value="${
                  item.quantidade
                }" min="1" onchange="alterarQuantidade(${
      item.produtoId
    }, this.value)">
                <button class="btn btn-secondary" onclick="alterarQuantidade(${
                  item.produtoId
                }, ${item.quantidade + 1})">+</button>
                <button class="btn btn-danger" onclick="removerDoCarrinho(${
                  item.produtoId
                })">Remover</button>
            </div>
        `;

    containerItens.appendChild(itemDiv);
  });

  atualizarResumoCarrinho();
}

function alterarQuantidade(produtoId, novaQuantidade) {
  const quantidade = parseInt(novaQuantidade);
  if (quantidade <= 0) {
    removerDoCarrinho(produtoId);
  } else {
    alterarQuantidadeCarrinho(produtoId, quantidade);
  }
}

function atualizarResumoCarrinho() {
  const subtotal = calcularSubtotal();
  const frete = subtotal >= configuracoes.freteGratis ? 0 : 30.0;
  const total = subtotal + frete;

  document.getElementById("subtotal").textContent = formatarMoeda(subtotal);
  document.getElementById("valor-frete").textContent =
    frete === 0 ? "Grátis" : formatarMoeda(frete);
  document.getElementById("total").textContent = formatarMoeda(total);
}

// ============================== FUNÇÕES DE CHECKOUT ==============================

function calcularFrete() {
  document.getElementById("modal-frete").style.display = "block";
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    mostrarAlerta("Carrinho vazio!", "erro");
    return;
  }

  document.getElementById("modal-checkout").style.display = "block";
  carregarDadosCheckout();
}

function carregarDadosCheckout() {
  // Carregar endereços
  const selectEndereco = document.getElementById("endereco-selecionado");
  selectEndereco.innerHTML = '<option value="">Selecionar endereço</option>';

  enderecos.forEach((endereco) => {
    const option = document.createElement("option");
    option.value = endereco.id;
    option.textContent = `${endereco.nome} - ${endereco.rua}`;
    selectEndereco.appendChild(option);
  });

  selectEndereco.innerHTML += '<option value="novo">Novo endereço</option>';

  // Carregar cartões
  const selectCartao = document.getElementById("cartao-selecionado");
  selectCartao.innerHTML = '<option value="">Selecionar cartão</option>';

  cartoes.forEach((cartao) => {
    const option = document.createElement("option");
    option.value = cartao.id;
    option.textContent = `${cartao.nome} - ${cartao.numero}`;
    selectCartao.appendChild(option);
  });

  selectCartao.innerHTML += '<option value="novo">Novo cartão</option>';

  // Carregar cupons
  const selectCupom = document.getElementById("cupom-selecionado");
  selectCupom.innerHTML = '<option value="">Selecionar cupom</option>';

  cupons
    .filter((c) => c.valido)
    .forEach((cupom) => {
      const option = document.createElement("option");
      option.value = cupom.codigo;
      option.textContent = `${cupom.codigo} - ${formatarMoeda(cupom.valor)}`;
      selectCupom.appendChild(option);
    });
}

function proximaEtapa(etapa) {
  // Ocultar todas as etapas
  document.querySelectorAll(".checkout-step").forEach((step) => {
    step.classList.remove("active");
  });
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
  });

  // Mostrar etapa atual
  document
    .getElementById(
      `step-${
        etapa === 1 ? "entrega" : etapa === 2 ? "pagamento" : "confirmacao"
      }`
    )
    .classList.add("active");
  document.querySelector(`.step[data-step="${etapa}"]`).classList.add("active");

  if (etapa === 3) {
    carregarResumoFinal();
  }
}

function etapaAnterior(etapa) {
  proximaEtapa(etapa);
}

function carregarResumoFinal() {
  const resumo = document.getElementById("resumo-final");
  const subtotal = calcularSubtotal();
  const frete = subtotal >= configuracoes.freteGratis ? 0 : 30.0;
  const total = subtotal + frete;

  resumo.innerHTML = `
        <h4>Resumo do Pedido</h4>
        <div class="pedido-itens">
            ${carrinho
              .map(
                (item) => `
                <div class="pedido-item">
                    <span>${item.nome} x${item.quantidade}</span>
                    <span>${formatarMoeda(item.preco * item.quantidade)}</span>
                </div>
            `
              )
              .join("")}
        </div>
        <div class="linha-resumo">
            <span>Subtotal:</span>
            <span>${formatarMoeda(subtotal)}</span>
        </div>
        <div class="linha-resumo">
            <span>Frete:</span>
            <span>${frete === 0 ? "Grátis" : formatarMoeda(frete)}</span>
        </div>
        <div class="linha-resumo total">
            <span>Total:</span>
            <span>${formatarMoeda(total)}</span>
        </div>
    `;
}

function validarCupom() {
  const codigo = document.getElementById("codigo-cupom").value;
  const cupom = cupons.find((c) => c.codigo === codigo && c.valido);

  if (cupom) {
    mostrarAlerta(
      `Cupom válido! Desconto de ${formatarMoeda(cupom.valor)}`,
      "sucesso"
    );
  } else {
    mostrarAlerta("Cupom inválido ou expirado!", "erro");
  }
}

// ============================== FUNÇÕES DE PEDIDOS ==============================

function carregarPedidos() {
  const container = document.getElementById("lista-pedidos");
  if (!container) return;

  container.innerHTML = "";

  pedidos.forEach((pedido) => {
    const pedidoDiv = document.createElement("div");
    pedidoDiv.className = "pedido-card";

    pedidoDiv.innerHTML = `
            <div class="pedido-header">
                <div class="pedido-info">
                    <h4>Pedido #${pedido.id}</h4>
                    <p>Data: ${formatarData(pedido.data)}</p>
                    <p>Total: ${formatarMoeda(pedido.total)}</p>
                </div>
                <div class="pedido-status status-${pedido.status.toLowerCase()}">
                    ${obterStatusTexto(pedido.status)}
                </div>
            </div>
            <div class="pedido-itens">
                ${pedido.itens
                  .map(
                    (item) => `
                    <div class="pedido-item">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>${formatarMoeda(
                          item.preco * item.quantidade
                        )}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="pedido-acoes">
                <button class="btn btn-secondary" onclick="verDetalhesPedido(${
                  pedido.id
                })">Ver Detalhes</button>
                ${
                  pedido.status === "ENTREGUE"
                    ? `<button class="btn btn-warning" onclick="solicitarTroca(${pedido.id})">Solicitar Troca</button>`
                    : ""
                }
            </div>
        `;

    container.appendChild(pedidoDiv);
  });
}

function filtrarPedidos() {
  const status = document.getElementById("status-filtro").value;
  const container = document.getElementById("lista-pedidos");

  const pedidosFiltrados = pedidos.filter(
    (pedido) => !status || pedido.status === status
  );

  container.innerHTML = "";

  pedidosFiltrados.forEach((pedido) => {
    const pedidoDiv = document.createElement("div");
    pedidoDiv.className = "pedido-card";

    pedidoDiv.innerHTML = `
            <div class="pedido-header">
                <div class="pedido-info">
                    <h4>Pedido #${pedido.id}</h4>
                    <p>Data: ${formatarData(pedido.data)}</p>
                    <p>Total: ${formatarMoeda(pedido.total)}</p>
                </div>
                <div class="pedido-status status-${pedido.status.toLowerCase()}">
                    ${obterStatusTexto(pedido.status)}
                </div>
            </div>
            <div class="pedido-itens">
                ${pedido.itens
                  .map(
                    (item) => `
                    <div class="pedido-item">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>${formatarMoeda(
                          item.preco * item.quantidade
                        )}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="pedido-acoes">
                <button class="btn btn-secondary" onclick="verDetalhesPedido(${
                  pedido.id
                })">Ver Detalhes</button>
                ${
                  pedido.status === "ENTREGUE"
                    ? `<button class="btn btn-warning" onclick="solicitarTroca(${pedido.id})">Solicitar Troca</button>`
                    : ""
                }
            </div>
        `;

    container.appendChild(pedidoDiv);
  });
}

function verDetalhesPedido(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return;

  const conteudo = document.getElementById("conteudo-detalhes");
  conteudo.innerHTML = `
        <div class="pedido-detalhes">
            <h4>Pedido #${pedido.id}</h4>
            <p><strong>Data:</strong> ${formatarData(pedido.data)}</p>
            <p><strong>Status:</strong> <span class="pedido-status status-${pedido.status.toLowerCase()}">${obterStatusTexto(
    pedido.status
  )}</span></p>
            <p><strong>Endereço:</strong> ${pedido.endereco}</p>
            <p><strong>Pagamento:</strong> ${pedido.pagamento}</p>
            
            <h5>Itens do Pedido:</h5>
            <div class="pedido-itens">
                ${pedido.itens
                  .map(
                    (item) => `
                    <div class="pedido-item">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>${formatarMoeda(
                          item.preco * item.quantidade
                        )}</span>
                    </div>
                `
                  )
                  .join("")}
            </div>
            
            <div class="linha-resumo">
                <span>Subtotal:</span>
                <span>${formatarMoeda(pedido.total - pedido.frete)}</span>
            </div>
            <div class="linha-resumo">
                <span>Frete:</span>
                <span>${formatarMoeda(pedido.frete)}</span>
            </div>
            <div class="linha-resumo total">
                <span>Total:</span>
                <span>${formatarMoeda(pedido.total)}</span>
            </div>
        </div>
    `;

  document.getElementById("modal-detalhes").style.display = "block";
}

function solicitarTroca(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return;

  const itensContainer = document.getElementById("itens-troca");
  itensContainer.innerHTML = `
        <h5>Selecione os itens para troca:</h5>
        ${pedido.itens
          .map(
            (item) => `
            <label class="opcao-pagamento">
                <input type="checkbox" name="item-troca" value="${
                  item.produtoId
                }">
                ${item.nome} x${item.quantidade} - ${formatarMoeda(
              item.preco * item.quantidade
            )}
            </label>
        `
          )
          .join("")}
    `;

  document.getElementById("modal-troca").style.display = "block";

  // Armazenar ID do pedido para uso posterior
  document.getElementById("form-troca").dataset.pedidoId = pedidoId;
}

// ============================== FUNÇÕES DE ADMINISTRAÇÃO ==============================

function carregarDadosAdmin() {
  carregarVendasAdmin();
  carregarTrocasAdmin();
  carregarEntregasAdmin();
}

function carregarVendasAdmin() {
  const container = document.getElementById("lista-vendas");
  if (!container) return;

  container.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${pedidos
                  .map(
                    (pedido) => `
                    <tr>
                        <td>#${pedido.id}</td>
                        <td>${formatarData(pedido.data)}</td>
                        <td>Cliente ${pedido.id}</td>
                        <td>${formatarMoeda(pedido.total)}</td>
                        <td><span class="pedido-status status-${pedido.status.toLowerCase()}">${obterStatusTexto(
                      pedido.status
                    )}</span></td>
                        <td class="tabela-acoes">
                            <button class="btn btn-secondary" onclick="verDetalhesVendaAdmin(${
                              pedido.id
                            })">Detalhes</button>
                            ${
                              pedido.status === "EM_PROCESSAMENTO"
                                ? `
                                <button class="btn btn-success" onclick="aprovarVendaRapida(${pedido.id})">Aprovar</button>
                                <button class="btn btn-danger" onclick="reprovarVendaRapida(${pedido.id})">Reprovar</button>
                            `
                                : ""
                            }
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function carregarTrocasAdmin() {
  const container = document.getElementById("lista-trocas");
  if (!container) return;

  // Filtrar apenas pedidos com status de troca
  const pedidosComTroca = pedidos.filter((p) =>
    ["EM_TROCA", "TROCA_AUTORIZADA", "TROCADO"].includes(p.status)
  );

  container.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${pedidosComTroca
                  .map(
                    (pedido) => `
                    <tr>
                        <td>#${pedido.id}</td>
                        <td>${formatarData(pedido.data)}</td>
                        <td>Cliente ${pedido.id}</td>
                        <td><span class="pedido-status status-${pedido.status.toLowerCase()}">${obterStatusTexto(
                      pedido.status
                    )}</span></td>
                        <td class="tabela-acoes">
                            ${
                              pedido.status === "EM_TROCA"
                                ? `
                                <button class="btn btn-warning" onclick="autorizarTrocaRapida(${pedido.id})">Autorizar</button>
                                <button class="btn btn-danger" onclick="negarTrocaRapida(${pedido.id})">Negar</button>
                            `
                                : ""
                            }
                            ${
                              pedido.status === "TROCA_AUTORIZADA"
                                ? `
                                <button class="btn btn-success" onclick="confirmarRecebimentoRapido(${pedido.id})">Confirmar Recebimento</button>
                            `
                                : ""
                            }
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function carregarEntregasAdmin() {
  const container = document.getElementById("lista-entregas");
  if (!container) return;

  // Filtrar pedidos para entrega
  const pedidosEntrega = pedidos.filter((p) =>
    ["APROVADA", "EM_TRANSITO", "ENTREGUE"].includes(p.status)
  );

  container.innerHTML = `
        <table class="tabela">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Endereço</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${pedidosEntrega
                  .map(
                    (pedido) => `
                    <tr>
                        <td>#${pedido.id}</td>
                        <td>${formatarData(pedido.data)}</td>
                        <td>Cliente ${pedido.id}</td>
                        <td>${pedido.endereco}</td>
                        <td><span class="pedido-status status-${pedido.status.toLowerCase()}">${obterStatusTexto(
                      pedido.status
                    )}</span></td>
                        <td class="tabela-acoes">
                            ${
                              pedido.status === "APROVADA"
                                ? `
                                <button class="btn btn-primary" onclick="despacharPedido(${pedido.id})">Despachar</button>
                            `
                                : ""
                            }
                            ${
                              pedido.status === "EM_TRANSITO"
                                ? `
                                <button class="btn btn-success" onclick="confirmarEntrega(${pedido.id})">Confirmar Entrega</button>
                            `
                                : ""
                            }
                        </td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
    `;
}

function mostrarTabAdmin(tabName) {
  // Ocultar todas as tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Mostrar tab selecionada
  document.getElementById(`tab-${tabName}`).classList.add("active");
  event.target.classList.add("active");
}

function aprovarVendaRapida(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "APROVADA";
    mostrarAlerta("Venda aprovada com sucesso!", "sucesso");
    carregarVendasAdmin();
    carregarEntregasAdmin();
  }
}

function reprovarVendaRapida(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "REPROVADA";
    mostrarAlerta("Venda reprovada!", "info");
    carregarVendasAdmin();
  }
}

function despacharPedido(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "EM_TRANSITO";
    mostrarAlerta("Pedido despachado para entrega!", "sucesso");
    carregarEntregasAdmin();
  }
}

function confirmarEntrega(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "ENTREGUE";
    mostrarAlerta("Entrega confirmada!", "sucesso");
    carregarEntregasAdmin();
  }
}

function autorizarTrocaRapida(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "TROCA_AUTORIZADA";
    mostrarAlerta("Troca autorizada!", "sucesso");
    carregarTrocasAdmin();
  }
}

function negarTrocaRapida(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "ENTREGUE";
    mostrarAlerta("Troca negada!", "info");
    carregarTrocasAdmin();
  }
}

function confirmarRecebimentoRapido(pedidoId) {
  const pedido = pedidos.find((p) => p.id === pedidoId);
  if (pedido) {
    pedido.status = "TROCADO";
    // Gerar cupom de troca
    const valorCupom = pedido.total - pedido.frete;
    const novoCupom = {
      codigo: `TROCA${Date.now()}`,
      tipo: "troca",
      valor: valorCupom,
      valido: true,
    };
    cupons.push(novoCupom);

    mostrarAlerta(
      `Recebimento confirmado! Cupom ${
        novoCupom.codigo
      } gerado no valor de ${formatarMoeda(valorCupom)}`,
      "sucesso"
    );
    carregarTrocasAdmin();
  }
}

function filtrarTabela(tipo) {
  if (tipo === "vendas") {
    const status = document.getElementById("status-vendas-filtro").value;
    carregarVendasAdmin();
  } else if (tipo === "trocas") {
    const status = document.getElementById("status-trocas-filtro").value;
    carregarTrocasAdmin();
  } else if (tipo === "entregas") {
    const status = document.getElementById("status-entregas-filtro").value;
    carregarEntregasAdmin();
  }
}

// ============================== FUNÇÕES DE MODALS ==============================

function inicializarModals() {
  // Fechar modals ao clicar no X
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.onclick = function () {
      this.closest(".modal").style.display = "none";
    };
  });

  // Fechar modals ao clicar fora
  window.onclick = function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  };

  // Configurar eventos de formulários
  const formFrete = document.getElementById("form-frete");
  if (formFrete) {
    formFrete.onsubmit = function (e) {
      e.preventDefault();
      const cep = document.getElementById("cep").value;
      if (cep) {
        // Simular cálculo de frete
        const frete = Math.random() * 50 + 10;
        document.getElementById("valor-frete").textContent =
          formatarMoeda(frete);
        atualizarResumoCarrinho();
        document.getElementById("modal-frete").style.display = "none";
        mostrarAlerta(`Frete calculado: ${formatarMoeda(frete)}`, "sucesso");
      }
    };
  }

  const formCheckout = document.getElementById("form-checkout");
  if (formCheckout) {
    formCheckout.onsubmit = function (e) {
      e.preventDefault();
      // Simular processamento do pedido
      const novoPedido = {
        id: Math.max(...pedidos.map((p) => p.id)) + 1,
        data: new Date().toISOString().split("T")[0],
        status: "EM_PROCESSAMENTO",
        itens: [...carrinho],
        total:
          calcularSubtotal() +
          (calcularSubtotal() >= configuracoes.freteGratis ? 0 : 30.0),
        frete: calcularSubtotal() >= configuracoes.freteGratis ? 0 : 30.0,
        endereco: "Endereço selecionado",
        pagamento: "Forma de pagamento selecionada",
      };

      pedidos.push(novoPedido);
      carrinho = [];
      salvarCarrinho();
      atualizarContadorCarrinho();

      document.getElementById("modal-checkout").style.display = "none";
      mostrarAlerta(
        `Pedido #${novoPedido.id} realizado com sucesso!`,
        "sucesso"
      );

      // Redirecionar para página de pedidos
      setTimeout(() => {
        window.location.href = "pedidos.html";
      }, 2000);
    };
  }

  const formTroca = document.getElementById("form-troca");
  if (formTroca) {
    formTroca.onsubmit = function (e) {
      e.preventDefault();
      const pedidoId = parseInt(this.dataset.pedidoId);
      const pedido = pedidos.find((p) => p.id === pedidoId);

      if (pedido) {
        pedido.status = "EM_TROCA";
        mostrarAlerta("Solicitação de troca enviada!", "sucesso");
        document.getElementById("modal-troca").style.display = "none";
        carregarPedidos();
      }
    };
  }

  // Configurar eventos de seleção
  const enderecoSelect = document.getElementById("endereco-selecionado");
  if (enderecoSelect) {
    enderecoSelect.onchange = function () {
      const novoEndereco = document.getElementById("novo-endereco");
      if (this.value === "novo") {
        novoEndereco.style.display = "block";
      } else {
        novoEndereco.style.display = "none";
      }
    };
  }

  const cartaoSelect = document.getElementById("cartao-selecionado");
  if (cartaoSelect) {
    cartaoSelect.onchange = function () {
      const novoCartao = document.getElementById("novo-cartao");
      if (this.value === "novo") {
        novoCartao.style.display = "block";
      } else {
        novoCartao.style.display = "none";
      }
    };
  }

  // Configurar opções de pagamento
  const opcoesPagamento = document.querySelectorAll('input[name="pagamento"]');
  opcoesPagamento.forEach((opcao) => {
    opcao.onchange = function () {
      document.querySelectorAll(".pagamento-detalhes").forEach((detalhe) => {
        detalhe.style.display = "none";
      });

      if (this.value === "cartao") {
        document.getElementById("cartao-dados").style.display = "block";
      } else if (this.value === "cupom") {
        document.getElementById("cupom-dados").style.display = "block";
      }
    };
  });
}

// ============================== INICIALIZAÇÃO ==============================

document.addEventListener("DOMContentLoaded", function () {
  // Inicializar contador do carrinho em todas as páginas
  atualizarContadorCarrinho();

  // Configurar eventos globais
  inicializarModals();
});

// ==============================
// DADOS MOCKADOS PARA CONTROLE DE ESTOQUE
// ==============================

// Dados mockados de livros
const livrosMockados = [
  {
    id: 1,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    isbn: "978-85-359-0277-5",
    categoria: "Literatura Brasileira",
    grupoPrecificacao: { percentual: 40 },
  },
  {
    id: 2,
    titulo: "1984",
    autor: "George Orwell",
    isbn: "978-85-250-4616-4",
    categoria: "Ficção Científica",
    grupoPrecificacao: { percentual: 50 },
  },
  {
    id: 3,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    isbn: "978-85-359-0816-6",
    categoria: "Literatura Infantil",
    grupoPrecificacao: { percentual: 35 },
  },
  {
    id: 4,
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    isbn: "978-0-13-235088-4",
    categoria: "Tecnologia",
    grupoPrecificacao: { percentual: 60 },
  },
  {
    id: 5,
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    isbn: "978-85-359-2866-9",
    categoria: "História",
    grupoPrecificacao: { percentual: 45 },
  },
];

// Dados mockados de estoque
let estoqueMockado = [
  {
    livroId: 1,
    quantidade: 15,
    valorCusto: 25.0,
    valorVenda: 35.0,
    dataUltimaEntrada: "2025-08-15",
    fornecedor: "Editora Globo",
  },
  {
    livroId: 2,
    quantidade: 8,
    valorCusto: 30.0,
    valorVenda: 45.0,
    dataUltimaEntrada: "2025-08-20",
    fornecedor: "Companhia das Letras",
  },
  {
    livroId: 3,
    quantidade: 3,
    valorCusto: 20.0,
    valorVenda: 27.0,
    dataUltimaEntrada: "2025-08-10",
    fornecedor: "Agir Editora",
  },
  {
    livroId: 4,
    quantidade: 0,
    valorCusto: 80.0,
    valorVenda: 128.0,
    dataUltimaEntrada: "2025-07-30",
    fornecedor: "Alta Books",
  },
  {
    livroId: 5,
    quantidade: 12,
    valorCusto: 35.0,
    valorVenda: 50.75,
    dataUltimaEntrada: "2025-08-25",
    fornecedor: "Companhia das Letras",
  },
];

// Histórico de entradas
let historicoEntradas = [
  {
    id: 1,
    livroId: 1,
    quantidade: 10,
    valorCusto: 25.0,
    valorVenda: 35.0,
    fornecedor: "Editora Globo",
    dataEntrada: "2025-08-15",
  },
  {
    id: 2,
    livroId: 2,
    quantidade: 5,
    valorCusto: 30.0,
    valorVenda: 45.0,
    fornecedor: "Companhia das Letras",
    dataEntrada: "2025-08-20",
  },
];

// Histórico de reentradas
let historicoReentradas = [
  {
    id: 1,
    livroId: 1,
    quantidade: 2,
    tipo: "troca",
    motivo: "produto_defeituoso",
    observacoes: "Páginas soltas",
    dataReentrada: "2025-08-25",
  },
];

// ==============================
// FUNÇÕES UTILITÁRIAS
// ==============================

// Busca livro por ID
function buscarLivroPorId(id) {
  return livrosMockados.find((livro) => livro.id == id);
}

// Busca estoque por livro ID
function buscarEstoquePorLivroId(livroId) {
  return estoqueMockado.find((item) => item.livroId == livroId);
}

// Calcula valor de venda
function calcularValorVenda(valorCusto, percentualPrecificacao) {
  return valorCusto * (1 + percentualPrecificacao / 100);
}

// Formata moeda
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

// Formata data
function formatarData(data) {
  return new Date(data).toLocaleDateString("pt-BR");
}

// Determina status do estoque
function determinarStatusEstoque(quantidade) {
  if (quantidade === 0) return "zerado";
  if (quantidade <= 5) return "baixo";
  return "disponivel";
}

// ==============================
// PÁGINA INDEX - DASHBOARD
// ==============================

// Inicializa dashboard quando a página carrega
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/"
  ) {
    initDashboard();
  }
});

function initDashboard() {
  atualizarResumoEstoque();
}

function atualizarResumoEstoque() {
  const totalLivros = estoqueMockado.reduce(
    (total, item) => total + item.quantidade,
    0
  );
  const valorTotal = estoqueMockado.reduce(
    (total, item) => total + item.quantidade * item.valorCusto,
    0
  );
  const livrosBaixoEstoque = estoqueMockado.filter(
    (item) => item.quantidade <= 5 && item.quantidade > 0
  ).length;

  const elementoTotalLivros = document.getElementById("totalLivros");
  const elementoValorTotal = document.getElementById("valorTotal");
  const elementoLivrosBaixoEstoque =
    document.getElementById("livrosBaixoEstoque");

  if (elementoTotalLivros) elementoTotalLivros.textContent = totalLivros;
  if (elementoValorTotal)
    elementoValorTotal.textContent = formatarMoeda(valorTotal);
  if (elementoLivrosBaixoEstoque)
    elementoLivrosBaixoEstoque.textContent = livrosBaixoEstoque;
}

// ==============================
// PÁGINA ENTRADA EM ESTOQUE
// ==============================

function initEntradaEstoque() {
  preencherSelectLivros("livroId");
  preencherDataAtual("dataEntrada");
  configurarCalculoValorVenda();
  carregarHistoricoEntradas();

  document
    .getElementById("formEntradaEstoque")
    .addEventListener("submit", processarEntradaEstoque);
}

function preencherSelectLivros(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">Selecione um livro</option>';
  livrosMockados.forEach((livro) => {
    const option = document.createElement("option");
    option.value = livro.id;
    option.textContent = `${livro.titulo} - ${livro.autor}`;
    select.appendChild(option);
  });
}

function preencherDataAtual(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const hoje = new Date().toISOString().split("T")[0];
  input.value = hoje;
}

function configurarCalculoValorVenda() {
  const livroSelect = document.getElementById("livroId");
  const valorCustoInput = document.getElementById("valorCusto");
  const valorVendaInput = document.getElementById("valorVenda");

  if (!livroSelect || !valorCustoInput || !valorVendaInput) return;

  function calcularEExibirValorVenda() {
    const livroId = livroSelect.value;
    const valorCusto = parseFloat(valorCustoInput.value);

    if (livroId && valorCusto > 0) {
      const livro = buscarLivroPorId(livroId);
      if (livro) {
        const valorVenda = calcularValorVenda(
          valorCusto,
          livro.grupoPrecificacao.percentual
        );
        valorVendaInput.value = valorVenda.toFixed(2);
      }
    } else {
      valorVendaInput.value = "";
    }
  }

  livroSelect.addEventListener("change", calcularEExibirValorVenda);
  valorCustoInput.addEventListener("input", calcularEExibirValorVenda);
}

function processarEntradaEstoque(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = {
    livroId: parseInt(formData.get("livroId")),
    quantidade: parseInt(formData.get("quantidade")),
    valorCusto: parseFloat(formData.get("valorCusto")),
    fornecedor: formData.get("fornecedor"),
    dataEntrada: formData.get("dataEntrada"),
    valorVenda: parseFloat(formData.get("valorVenda")),
  };

  // Validações conforme RN0051, RN0061, RN0062, RNF0064
  if (!validarEntradaEstoque(dados)) {
    return;
  }

  // Registra entrada
  registrarEntradaEstoque(dados);

  // Limpa formulário
  event.target.reset();
  preencherDataAtual("dataEntrada");

  // Atualiza histórico
  carregarHistoricoEntradas();

  alert("Entrada registrada com sucesso!");
}

function validarEntradaEstoque(dados) {
  // RN0061: Quantidade não pode ser zero
  if (dados.quantidade <= 0) {
    alert("A quantidade deve ser maior que zero.");
    return false;
  }

  // RN0062: Deve haver valor de custo
  if (dados.valorCusto <= 0) {
    alert("O valor de custo deve ser maior que zero.");
    return false;
  }

  // RNF0064: Data de entrada obrigatória
  if (!dados.dataEntrada) {
    alert("A data de entrada é obrigatória.");
    return false;
  }

  return true;
}

function registrarEntradaEstoque(dados) {
  // Adiciona ao histórico
  const novaEntrada = {
    id: historicoEntradas.length + 1,
    ...dados,
  };
  historicoEntradas.unshift(novaEntrada);

  // Atualiza estoque existente ou cria novo
  let itemEstoque = buscarEstoquePorLivroId(dados.livroId);

  if (itemEstoque) {
    // RN005x: Se há valores diferentes, usar o maior valor de custo
    if (dados.valorCusto > itemEstoque.valorCusto) {
      const livro = buscarLivroPorId(dados.livroId);
      itemEstoque.valorCusto = dados.valorCusto;
      itemEstoque.valorVenda = calcularValorVenda(
        dados.valorCusto,
        livro.grupoPrecificacao.percentual
      );
    }
    itemEstoque.quantidade += dados.quantidade;
    itemEstoque.dataUltimaEntrada = dados.dataEntrada;
    itemEstoque.fornecedor = dados.fornecedor;
  } else {
    // Novo item no estoque
    estoqueMockado.push({
      livroId: dados.livroId,
      quantidade: dados.quantidade,
      valorCusto: dados.valorCusto,
      valorVenda: dados.valorVenda,
      dataUltimaEntrada: dados.dataEntrada,
      fornecedor: dados.fornecedor,
    });
  }
}

function carregarHistoricoEntradas() {
  const tbody = document.querySelector("#tabelaHistoricoEntradas tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  historicoEntradas.slice(0, 10).forEach((entrada) => {
    const livro = buscarLivroPorId(entrada.livroId);
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatarData(entrada.dataEntrada)}</td>
            <td>${livro ? livro.titulo : "N/A"}</td>
            <td>${entrada.quantidade}</td>
            <td>${formatarMoeda(entrada.valorCusto)}</td>
            <td>${formatarMoeda(entrada.valorVenda)}</td>
            <td>${entrada.fornecedor}</td>
        `;
    tbody.appendChild(row);
  });
}

function limparFormulario() {
  document.getElementById("formEntradaEstoque").reset();
  preencherDataAtual("dataEntrada");
  document.getElementById("valorVenda").value = "";
}

// ==============================
// PÁGINA CONSULTAR ESTOQUE
// ==============================

let dadosFiltrados = [];

function initConsultarEstoque() {
  carregarTabelaEstoque();
  configurarFiltros();
}

function carregarTabelaEstoque(filtros = {}) {
  const tbody = document.querySelector("#tabelaEstoque tbody");
  if (!tbody) return;

  // Aplica filtros
  dadosFiltrados = estoqueMockado.filter((item) => {
    const livro = buscarLivroPorId(item.livroId);
    if (!livro) return false;

    if (
      filtros.titulo &&
      !livro.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
    ) {
      return false;
    }

    if (
      filtros.autor &&
      !livro.autor.toLowerCase().includes(filtros.autor.toLowerCase())
    ) {
      return false;
    }

    if (filtros.isbn && !livro.isbn.includes(filtros.isbn)) {
      return false;
    }

    if (filtros.estoque) {
      const status = determinarStatusEstoque(item.quantidade);
      if (status !== filtros.estoque) {
        return false;
      }
    }

    return true;
  });

  // Paginação
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensPagina = dadosFiltrados.slice(inicio, fim);

  // Limpa tabela
  tbody.innerHTML = "";

  // Preenche tabela
  itensPagina.forEach((item) => {
    const livro = buscarLivroPorId(item.livroId);
    const status = determinarStatusEstoque(item.quantidade);
    const statusClass = `status-${status}`;
    const statusText =
      status === "disponivel"
        ? "Disponível"
        : status === "baixo"
        ? "Baixo Estoque"
        : "Sem Estoque";

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.isbn}</td>
            <td>${item.quantidade}</td>
            <td>${formatarMoeda(item.valorCusto)}</td>
            <td>${formatarMoeda(item.valorVenda)}</td>
            <td>${livro.categoria}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <button class="btn btn-small btn-primary" onclick="mostrarDetalhes(${
                  item.livroId
                })">
                    Detalhes
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });

  // Atualiza informações de paginação
  atualizarPaginacao(totalPaginas);
}

function configurarFiltros() {
  const filtros = [
    "filtroTitulo",
    "filtroAutor",
    "filtroISBN",
    "filtroEstoque",
  ];

  filtros.forEach((filtroId) => {
    const elemento = document.getElementById(filtroId);
    if (elemento) {
      elemento.addEventListener("input", aplicarFiltros);
    }
  });
}

function aplicarFiltros() {
  const filtros = {
    titulo: document.getElementById("filtroTitulo")?.value || "",
    autor: document.getElementById("filtroAutor")?.value || "",
    isbn: document.getElementById("filtroISBN")?.value || "",
    estoque: document.getElementById("filtroEstoque")?.value || "",
  };

  paginaAtual = 1;
  carregarTabelaEstoque(filtros);
}

function limparFiltros() {
  document.getElementById("filtroTitulo").value = "";
  document.getElementById("filtroAutor").value = "";
  document.getElementById("filtroISBN").value = "";
  document.getElementById("filtroEstoque").value = "";

  paginaAtual = 1;
  carregarTabelaEstoque();
}

function atualizarPaginacao(totalPaginas) {
  const infoPagina = document.getElementById("infoPagina");
  const btnAnterior = document.getElementById("btnAnterior");
  const btnProximo = document.getElementById("btnProximo");

  if (infoPagina) {
    infoPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  }

  if (btnAnterior) {
    btnAnterior.disabled = paginaAtual === 1;
  }

  if (btnProximo) {
    btnProximo.disabled = paginaAtual === totalPaginas || totalPaginas === 0;
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    aplicarFiltros();
  }
}

function proximaPagina() {
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    aplicarFiltros();
  }
}

function mostrarDetalhes(livroId) {
  const item = buscarEstoquePorLivroId(livroId);
  const livro = buscarLivroPorId(livroId);

  if (!item || !livro) return;

  const status = determinarStatusEstoque(item.quantidade);
  const statusText =
    status === "disponivel"
      ? "Disponível"
      : status === "baixo"
      ? "Baixo Estoque"
      : "Sem Estoque";

  const conteudo = `
        <div class="detalhes-item">
            <h4>${livro.titulo}</h4>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>ISBN:</strong> ${livro.isbn}</p>
            <p><strong>Categoria:</strong> ${livro.categoria}</p>
            <p><strong>Quantidade:</strong> ${item.quantidade}</p>
            <p><strong>Valor de Custo:</strong> ${formatarMoeda(
              item.valorCusto
            )}</p>
            <p><strong>Valor de Venda:</strong> ${formatarMoeda(
              item.valorVenda
            )}</p>
            <p><strong>Status:</strong> ${statusText}</p>
            <p><strong>Último Fornecedor:</strong> ${item.fornecedor}</p>
            <p><strong>Data Última Entrada:</strong> ${formatarData(
              item.dataUltimaEntrada
            )}</p>
        </div>
    `;

  document.getElementById("conteudoDetalhes").innerHTML = conteudo;
  document.getElementById("modalDetalhes").style.display = "block";
}

function fecharModal() {
  document.getElementById("modalDetalhes").style.display = "none";
}

// ==============================
// PÁGINA REENTRADA DE ESTOQUE
// ==============================

function initReentradaEstoque() {
  preencherSelectLivros("livroReentrada");
  preencherDataAtual("dataReentrada");
  carregarHistoricoReentradas();

  document
    .getElementById("formReentradaEstoque")
    .addEventListener("submit", processarReentradaEstoque);
}

function atualizarCamposOperacao() {
  const tipoOperacao = document.getElementById("tipoOperacao").value;
  const numeroVenda = document.getElementById("numeroVenda");

  if (tipoOperacao === "troca" || tipoOperacao === "devolucao") {
    numeroVenda.required = true;
    numeroVenda.placeholder = "Número da venda original";
  } else {
    numeroVenda.required = false;
    numeroVenda.placeholder = "Opcional";
  }
}

function processarReentradaEstoque(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const dados = {
    tipoOperacao: formData.get("tipoOperacao"),
    numeroVenda: formData.get("numeroVenda"),
    livroId: parseInt(formData.get("livroReentrada")),
    quantidade: parseInt(formData.get("quantidadeReentrada")),
    dataReentrada: formData.get("dataReentrada"),
    motivo: formData.get("motivoReentrada"),
    observacoes: formData.get("observacoes"),
  };

  if (!validarReentradaEstoque(dados)) {
    return;
  }

  // Registra reentrada
  registrarReentradaEstoque(dados);

  // Limpa formulário
  event.target.reset();
  preencherDataAtual("dataReentrada");

  // Atualiza histórico
  carregarHistoricoReentradas();

  alert("Reentrada processada com sucesso!");
}

function validarReentradaEstoque(dados) {
  if (dados.quantidade <= 0) {
    alert("A quantidade deve ser maior que zero.");
    return false;
  }

  if (!dados.dataReentrada) {
    alert("A data de reentrada é obrigatória.");
    return false;
  }

  if (
    (dados.tipoOperacao === "troca" || dados.tipoOperacao === "devolucao") &&
    !dados.numeroVenda
  ) {
    alert("Para trocas e devoluções, o número da venda é obrigatório.");
    return false;
  }

  return true;
}

function registrarReentradaEstoque(dados) {
  // Adiciona ao histórico
  const novaReentrada = {
    id: historicoReentradas.length + 1,
    ...dados,
  };
  historicoReentradas.unshift(novaReentrada);

  // Atualiza estoque - RF0054: Realizar reentrada em estoque
  let itemEstoque = buscarEstoquePorLivroId(dados.livroId);

  if (itemEstoque) {
    itemEstoque.quantidade += dados.quantidade;
  } else {
    // Se não existe no estoque, cria novo item com custo zerado
    estoqueMockado.push({
      livroId: dados.livroId,
      quantidade: dados.quantidade,
      valorCusto: 0,
      valorVenda: 0,
      dataUltimaEntrada: dados.dataReentrada,
      fornecedor: "Reentrada",
    });
  }
}

function carregarHistoricoReentradas() {
  const tbody = document.querySelector("#tabelaHistoricoReentradas tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  historicoReentradas.slice(0, 10).forEach((reentrada) => {
    const livro = buscarLivroPorId(reentrada.livroId);
    const tipoTexto =
      reentrada.tipo === "troca"
        ? "Troca"
        : reentrada.tipo === "devolucao"
        ? "Devolução"
        : "Ajuste";
    const motivoTexto = reentrada.motivo
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${formatarData(reentrada.dataReentrada)}</td>
            <td>${livro ? livro.titulo : "N/A"}</td>
            <td>${reentrada.quantidade}</td>
            <td>${tipoTexto}</td>
            <td>${motivoTexto}</td>
            <td>${reentrada.observacoes || "-"}</td>
        `;
    tbody.appendChild(row);
  });
}

function limparFormularioReentrada() {
  document.getElementById("formReentradaEstoque").reset();
  preencherDataAtual("dataReentrada");
}

// ==============================
// FUNÇÕES GLOBAIS
// ==============================

// Fecha modal ao clicar fora
window.onclick = function (event) {
  const modal = document.getElementById("modalDetalhes");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ==============================
// DADOS MOCKADOS PARA ANÁLISE DE VENDAS
// ==============================

const dadosVendasMock = {
  produtos: {
    livro1: { nome: "Dom Casmurro", categoria: "classicos", preco: 25.9 },
    livro2: { nome: "O Alquimista", categoria: "autoajuda", preco: 32.9 },
    livro3: { nome: "1984", categoria: "ficcao", preco: 28.5 },
    livro4: { nome: "O Pequeno Príncipe", categoria: "ficcao", preco: 22.9 },
    livro5: {
      nome: "Harry Potter - Pedra Filosofal",
      categoria: "fantasia",
      preco: 45.9,
    },
  },

  categorias: {
    ficcao: "Ficção",
    romance: "Romance",
    fantasia: "Fantasia",
    autoajuda: "Autoajuda",
    classicos: "Clássicos",
  },

  // Dados de vendas por data
  vendasPorData: {
    "2024-01-15": { livro1: 5, livro2: 3, livro3: 7, livro4: 2, livro5: 4 },
    "2024-01-20": { livro1: 3, livro2: 8, livro3: 4, livro4: 6, livro5: 2 },
    "2024-01-25": { livro1: 7, livro2: 2, livro3: 9, livro4: 3, livro5: 8 },
    "2024-02-01": { livro1: 4, livro2: 6, livro3: 2, livro4: 8, livro5: 5 },
    "2024-02-05": { livro1: 6, livro2: 4, livro3: 8, livro4: 1, livro5: 7 },
    "2024-02-10": { livro1: 2, livro2: 9, livro3: 3, livro4: 5, livro5: 6 },
    "2024-02-15": { livro1: 8, livro2: 1, livro3: 6, livro4: 4, livro5: 3 },
    "2024-02-20": { livro1: 5, livro2: 7, livro3: 4, livro4: 9, livro5: 2 },
  },
};

// ==============================
// FUNÇÕES PARA ANÁLISE DE VENDAS
// ==============================

function inicializarAnaliseVendas() {
  // Configurar datas padrão
  const hoje = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(hoje.getDate() - 30);

  document.getElementById("dataInicio").value = trintaDiasAtras
    .toISOString()
    .split("T")[0];
  document.getElementById("dataFim").value = hoje.toISOString().split("T")[0];

  // Event listeners
  document
    .getElementById("tipoAnalise")
    .addEventListener("change", alternarTipoAnalise);
  document
    .getElementById("btnAnalisar")
    .addEventListener("click", analisarVendas);

  // Selecionar alguns itens por padrão
  document.getElementById("produtos").selectedIndex = 0;
}

function alternarTipoAnalise() {
  const tipoAnalise = document.getElementById("tipoAnalise").value;
  const produtosFiltro = document.getElementById("produtosFiltro");
  const categoriasFiltro = document.getElementById("categoriasFiltro");

  if (tipoAnalise === "produtos") {
    produtosFiltro.style.display = "flex";
    categoriasFiltro.style.display = "none";
  } else {
    produtosFiltro.style.display = "none";
    categoriasFiltro.style.display = "flex";
  }
}

function analisarVendas() {
  const dataInicio = new Date(document.getElementById("dataInicio").value);
  const dataFim = new Date(document.getElementById("dataFim").value);
  const tipoAnalise = document.getElementById("tipoAnalise").value;

  // Validar datas
  if (dataInicio > dataFim) {
    alert("A data de início deve ser anterior à data de fim!");
    return;
  }

  // Obter itens selecionados
  let itensSelecionados = [];
  if (tipoAnalise === "produtos") {
    const produtosSelecionados = Array.from(
      document.getElementById("produtos").selectedOptions
    );
    itensSelecionados = produtosSelecionados.map((option) => option.value);
  } else {
    const categoriasSelecionadas = Array.from(
      document.getElementById("categorias").selectedOptions
    );
    itensSelecionados = categoriasSelecionadas.map((option) => option.value);
  }

  if (itensSelecionados.length === 0) {
    alert("Selecione pelo menos um item para análise!");
    return;
  }

  // Processar dados
  const dadosProcessados = processarDadosVendas(
    dataInicio,
    dataFim,
    tipoAnalise,
    itensSelecionados
  );

  // Exibir resultados
  exibirResultados(dadosProcessados, dataInicio, dataFim);

  // Mostrar container de resultados
  document.getElementById("resultadosContainer").style.display = "block";
}

function processarDadosVendas(
  dataInicio,
  dataFim,
  tipoAnalise,
  itensSelecionados
) {
  let totalVendas = 0;
  let quantidadeTotal = 0;
  let dadosGrafico = [];
  let detalhesVendas = [];

  // Filtrar dados por período
  const datasOrdenadas = Object.keys(dadosVendasMock.vendasPorData)
    .filter((data) => {
      const dataVenda = new Date(data);
      return dataVenda >= dataInicio && dataVenda <= dataFim;
    })
    .sort();

  if (tipoAnalise === "produtos") {
    // Análise por produtos
    itensSelecionados.forEach((produtoId) => {
      const produto = dadosVendasMock.produtos[produtoId];
      let quantidadeProduto = 0;
      let valorProduto = 0;
      let dadosProdutoGrafico = { nome: produto.nome, dados: [] };

      datasOrdenadas.forEach((data) => {
        const qtdVendida = dadosVendasMock.vendasPorData[data][produtoId] || 0;
        quantidadeProduto += qtdVendida;
        valorProduto += qtdVendida * produto.preco;

        dadosProdutoGrafico.dados.push({
          data: data,
          quantidade: qtdVendida,
        });
      });

      totalVendas += valorProduto;
      quantidadeTotal += quantidadeProduto;
      dadosGrafico.push(dadosProdutoGrafico);

      detalhesVendas.push({
        item: produto.nome,
        categoria: dadosVendasMock.categorias[produto.categoria],
        quantidade: quantidadeProduto,
        valor: valorProduto,
      });
    });
  } else {
    // Análise por categorias
    itensSelecionados.forEach((categoriaId) => {
      const nomeCategoria = dadosVendasMock.categorias[categoriaId];
      let quantidadeCategoria = 0;
      let valorCategoria = 0;
      let dadosCategoriaGrafico = { nome: nomeCategoria, dados: [] };

      datasOrdenadas.forEach((data) => {
        let qtdDataCategoria = 0;

        // Somar vendas de todos os produtos da categoria
        Object.keys(dadosVendasMock.produtos).forEach((produtoId) => {
          const produto = dadosVendasMock.produtos[produtoId];
          if (produto.categoria === categoriaId) {
            const qtdVendida =
              dadosVendasMock.vendasPorData[data][produtoId] || 0;
            quantidadeCategoria += qtdVendida;
            valorCategoria += qtdVendida * produto.preco;
            qtdDataCategoria += qtdVendida;
          }
        });

        dadosCategoriaGrafico.dados.push({
          data: data,
          quantidade: qtdDataCategoria,
        });
      });

      totalVendas += valorCategoria;
      quantidadeTotal += quantidadeCategoria;
      dadosGrafico.push(dadosCategoriaGrafico);

      detalhesVendas.push({
        item: nomeCategoria,
        categoria: "Categoria",
        quantidade: quantidadeCategoria,
        valor: valorCategoria,
      });
    });
  }

  return {
    totalVendas,
    quantidadeTotal,
    dadosGrafico,
    detalhesVendas,
    datasOrdenadas,
  };
}

function exibirResultados(dados, dataInicio, dataFim) {
  // Atualizar resumo
  document.getElementById(
    "totalVendas"
  ).textContent = `R$ ${dados.totalVendas.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;

  document.getElementById(
    "quantidadeVendida"
  ).textContent = `${dados.quantidadeTotal} livros`;

  document.getElementById(
    "periodoAnalise"
  ).textContent = `${dataInicio.toLocaleDateString(
    "pt-BR"
  )} a ${dataFim.toLocaleDateString("pt-BR")}`;

  // Gerar gráfico
  gerarGraficoLinhas(dados.dadosGrafico, dados.datasOrdenadas);

  // Preencher tabela de detalhes
  preencherTabelaDetalhes(dados.detalhesVendas, dataInicio, dataFim);
}

function gerarGraficoLinhas(dadosGrafico, datasOrdenadas) {
  const canvas = document.getElementById("graficoVendas");
  const ctx = canvas.getContext("2d");

  // Limpar canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const width = canvas.width;
  const height = canvas.height;
  const padding = 60;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Configurar escalas
  const maxQuantidade = Math.max(
    ...dadosGrafico.flatMap((serie) =>
      serie.dados.map((ponto) => ponto.quantidade)
    )
  );

  const scaleX = graphWidth / (datasOrdenadas.length - 1 || 1);
  const scaleY = graphHeight / (maxQuantidade || 1);

  // Cores para as linhas
  const cores = ["#2196f3", "#4caf50", "#ff9800", "#e91e63", "#9c27b0"];

  // Desenhar eixos
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 1;

  // Eixo X
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Eixo Y
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // Labels do eixo X (datas)
  ctx.fillStyle = "#666";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  datasOrdenadas.forEach((data, index) => {
    const x = padding + index * scaleX;
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    ctx.fillText(dataFormatada, x, height - padding + 20);
  });

  // Labels do eixo Y
  ctx.textAlign = "right";
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (i * graphHeight) / 5;
    const valor = Math.round((i * maxQuantidade) / 5);
    ctx.fillText(valor.toString(), padding - 10, y + 5);
  }

  // Desenhar linhas dos dados
  dadosGrafico.forEach((serie, serieIndex) => {
    ctx.strokeStyle = cores[serieIndex % cores.length];
    ctx.fillStyle = cores[serieIndex % cores.length];
    ctx.lineWidth = 3;

    // Desenhar linha
    ctx.beginPath();
    serie.dados.forEach((ponto, index) => {
      const x = padding + index * scaleX;
      const y = height - padding - ponto.quantidade * scaleY;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Desenhar pontos
    serie.dados.forEach((ponto, index) => {
      const x = padding + index * scaleX;
      const y = height - padding - ponto.quantidade * scaleY;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

  // Legenda
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  dadosGrafico.forEach((serie, index) => {
    const y = 30 + index * 20;
    ctx.fillStyle = cores[index % cores.length];
    ctx.fillRect(width - 200, y - 10, 15, 15);
    ctx.fillStyle = "#333";
    ctx.fillText(serie.nome, width - 180, y + 2);
  });
}

function preencherTabelaDetalhes(detalhesVendas, dataInicio, dataFim) {
  const corpoTabela = document.getElementById("corpoTabelaDetalhes");
  corpoTabela.innerHTML = "";

  const periodo = `${dataInicio.toLocaleDateString(
    "pt-BR"
  )} - ${dataFim.toLocaleDateString("pt-BR")}`;

  detalhesVendas.forEach((detalhe) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
            <td>${detalhe.item}</td>
            <td>${detalhe.categoria}</td>
            <td>${detalhe.quantidade}</td>
            <td>R$ ${detalhe.valor.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}</td>
            <td>${periodo}</td>
        `;
    corpoTabela.appendChild(linha);
  });
}

// ==============================
// INICIALIZAÇÃO DA PÁGINA
// ==============================

// Verificar se estamos na página de análise de vendas
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("btnAnalisar")) {
    inicializarAnaliseVendas();
  }
});

// ============================== DADOS MOCKADOS IA ==============================

const livrosMockadosIA = [
  {
    id: 1,
    titulo: "Dune",
    autor: "Frank Herbert",
    genero: "ficcao",
    confianca: "alta",
    confiancaValor: 94,
    motivo: "Baseado no seu interesse por ficção científica e livros épicos",
    preco: 45.9,
    avaliacao: 4.7,
    paginas: 688,
  },
  {
    id: 2,
    titulo: "1984",
    autor: "George Orwell",
    genero: "ficcao",
    confianca: "alta",
    confiancaValor: 92,
    motivo: "Você gostou de livros distópicos e reflexivos",
    preco: 32.5,
    avaliacao: 4.6,
    paginas: 416,
  },
  {
    id: 3,
    titulo: "O Nome do Vento",
    autor: "Patrick Rothfuss",
    genero: "fantasia",
    confianca: "media",
    confiancaValor: 78,
    motivo: "Similar aos livros de fantasia que você avaliou positivamente",
    preco: 52.9,
    avaliacao: 4.8,
    paginas: 662,
  },
  {
    id: 4,
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    genero: "romance",
    confianca: "media",
    confiancaValor: 73,
    motivo: "Baseado no seu histórico com romances clássicos",
    preco: 28.9,
    avaliacao: 4.4,
    paginas: 432,
  },
  {
    id: 5,
    titulo: "O Código Da Vinci",
    autor: "Dan Brown",
    genero: "misterio",
    confianca: "baixa",
    confiancaValor: 65,
    motivo: "Experimentando novos gêneros baseado em usuários similares",
    preco: 38.5,
    avaliacao: 4.1,
    paginas: 590,
  },
  {
    id: 6,
    titulo: "Steve Jobs",
    autor: "Walter Isaacson",
    genero: "biografia",
    confianca: "media",
    confiancaValor: 81,
    motivo: "Você demonstrou interesse em biografias de inovadores",
    preco: 64.9,
    avaliacao: 4.5,
    paginas: 656,
  },
];

const historicoCompras = [
  {
    id: 1,
    titulo: "O Senhor dos Anéis",
    autor: "J.R.R. Tolkien",
    dataCompra: "2024-08-15",
    preco: 89.9,
    avaliacao: 5,
    genero: "fantasia",
  },
  {
    id: 2,
    titulo: "Neuromancer",
    autor: "William Gibson",
    dataCompra: "2024-08-10",
    preco: 42.5,
    avaliacao: 4,
    genero: "ficcao",
  },
  {
    id: 3,
    titulo: "A Guerra dos Tronos",
    autor: "George R.R. Martin",
    dataCompra: "2024-07-28",
    preco: 55.9,
    avaliacao: 5,
    genero: "fantasia",
  },
  {
    id: 4,
    titulo: "Fundação",
    autor: "Isaac Asimov",
    dataCompra: "2024-07-15",
    preco: 38.9,
    avaliacao: 4,
    genero: "ficcao",
  },
  {
    id: 5,
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    dataCompra: "2024-07-02",
    preco: 34.9,
    avaliacao: 5,
    genero: "fantasia",
  },
];

let conversaChat = [
  {
    tipo: "bot",
    mensagem:
      "Olá! Sou seu assistente de livros com IA. Como posso ajudá-lo hoje?",
    timestamp: new Date(),
  },
  {
    tipo: "bot",
    mensagem:
      "Posso sugerir livros baseados em seus gostos, ajudar a encontrar algo específico, ou responder dúvidas sobre nosso catálogo!",
    timestamp: new Date(),
  },
];

// ============================== FUNÇÕES GERAIS ==============================

function formatarData(data) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(data).toLocaleDateString("pt-BR", options);
}

function formatarPreco(preco) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(preco);
}

function gerarEstrelas(avaliacao) {
  const estrelasCompletas = Math.floor(avaliacao);
  const temMeiaEstrela = avaliacao % 1 >= 0.5;
  let html = "";

  for (let i = 0; i < estrelasCompletas; i++) {
    html += "⭐";
  }
  if (temMeiaEstrela) {
    html += "⭐";
  }

  return html;
}

// ============================== FUNÇÕES DE RECOMENDAÇÕES ==============================

function carregarRecomendacoes() {
  const container = document.getElementById("recomendacoes-lista");
  if (!container) return;

  container.innerHTML = "";

  livrosMockadosIA.forEach((livro) => {
    const card = criarCardRecomendacao(livro);
    container.appendChild(card);
  });
}

function criarCardRecomendacao(livro) {
  const card = document.createElement("div");
  card.className = "recomendacao-card";
  card.setAttribute("data-genero", livro.genero);
  card.setAttribute("data-confianca", livro.confianca);

  card.innerHTML = `
        <div class="recomendacao-header">
            <div class="livro-info">
                <h4>${livro.titulo}</h4>
                <p>por ${livro.autor}</p>
            </div>
            <span class="confianca-badge confianca-${livro.confianca}">
                ${livro.confiancaValor}%
            </span>
        </div>
        
        <div class="recomendacao-motivo">
            💡 ${livro.motivo}
        </div>
        
        <div class="livro-detalhes">
            <p><strong>Gênero:</strong> ${
              livro.genero.charAt(0).toUpperCase() + livro.genero.slice(1)
            }</p>
            <p><strong>Páginas:</strong> ${livro.paginas}</p>
            <p><strong>Avaliação:</strong> ${gerarEstrelas(livro.avaliacao)} ${
    livro.avaliacao
  }/5</p>
            <p><strong>Preço:</strong> ${formatarPreco(livro.preco)}</p>
        </div>
        
        <div class="recomendacao-actions">
            <button class="btn-action btn-like" onclick="avaliarRecomendacao(${
              livro.id
            }, 'like')">
                👍 Gostei
            </button>
            <button class="btn-action btn-dislike" onclick="avaliarRecomendacao(${
              livro.id
            }, 'dislike')">
                👎 Não gostei
            </button>
            <button class="btn-action btn-info" onclick="verDetalhes(${
              livro.id
            })">
                📖 Detalhes
            </button>
        </div>
    `;

  return card;
}

function gerarNovasRecomendacoes() {
  const button = document.querySelector(".page-header button");
  button.textContent = "🔄 Gerando...";
  button.disabled = true;

  setTimeout(() => {
    // Simular nova geração embaralhando a lista
    livrosMockadosIA.sort(() => Math.random() - 0.5);
    carregarRecomendacoes();

    button.textContent = "✨ Gerar Novas Recomendações";
    button.disabled = false;

    mostrarNotificacao(
      "Novas recomendações geradas com base no seu perfil!",
      "sucesso"
    );
  }, 2000);
}

function filtrarRecomendacoes() {
  const generoFiltro = document.getElementById("genero-filter").value;
  const confiancaFiltro = document.getElementById("confianca-filter").value;

  const cards = document.querySelectorAll(".recomendacao-card");

  cards.forEach((card) => {
    const genero = card.getAttribute("data-genero");
    const confianca = card.getAttribute("data-confianca");

    let mostrar = true;

    if (generoFiltro && genero !== generoFiltro) {
      mostrar = false;
    }

    if (confiancaFiltro && confianca !== confiancaFiltro) {
      mostrar = false;
    }

    card.style.display = mostrar ? "block" : "none";
  });
}

function avaliarRecomendacao(id, tipo) {
  const livro = livrosMockadosIA.find((l) => l.id === id);
  const acao = tipo === "like" ? "curtiu" : "não curtiu";

  mostrarNotificacao(
    `Você ${acao} "${livro.titulo}". A IA utilizará este feedback!`,
    "info"
  );

  // Simular atualização do modelo
  setTimeout(() => {
    mostrarNotificacao("Modelo de IA atualizado com seu feedback!", "sucesso");
  }, 1000);
}

function verDetalhes(id) {
  const livro = livrosMockadosIA.find((l) => l.id === id);
  alert(
    `📖 ${livro.titulo}\n\n👤 Autor: ${livro.autor}\n📊 Avaliação: ${
      livro.avaliacao
    }/5\n📄 Páginas: ${livro.paginas}\n💰 Preço: ${formatarPreco(
      livro.preco
    )}\n\n💡 Por que recomendamos:\n${livro.motivo}`
  );
}

function enviarFeedback() {
  const textarea = document.getElementById("feedback-text");
  const feedback = textarea.value.trim();

  if (!feedback) {
    mostrarNotificacao(
      "Por favor, escreva seu feedback antes de enviar.",
      "erro"
    );
    return;
  }

  textarea.value = "";
  mostrarNotificacao(
    "Feedback enviado! Obrigado por nos ajudar a melhorar.",
    "sucesso"
  );

  // Simular processamento do feedback
  setTimeout(() => {
    mostrarNotificacao("Seu feedback foi processado pela IA!", "info");
  }, 2000);
}

// ============================== FUNÇÕES DO CHATBOT ==============================

function enviarMensagem() {
  const input = document.getElementById("chat-input");
  const mensagem = input.value.trim();

  if (!mensagem) return;

  // Adicionar mensagem do usuário
  adicionarMensagemChat("user", mensagem);
  input.value = "";

  // Simular resposta da IA
  setTimeout(() => {
    const resposta = gerarRespostaIA(mensagem);
    adicionarMensagemChat("bot", resposta);
  }, 1000 + Math.random() * 2000);
}

function adicionarMensagemChat(tipo, mensagem) {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${tipo}-message`;

  const avatar = tipo === "bot" ? "🤖" : "👤";
  const timestamp = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${mensagem}</p>
            <span class="message-time">${timestamp}</span>
        </div>
    `;

  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Adicionar ao histórico
  conversaChat.push({
    tipo: tipo,
    mensagem: mensagem,
    timestamp: new Date(),
  });
}

function gerarRespostaIA(mensagem) {
  const mensagemLower = mensagem.toLowerCase();

  // Respostas baseadas em palavras-chave
  if (
    mensagemLower.includes("ficção científica") ||
    mensagemLower.includes("sci-fi")
  ) {
    return 'Ótima escolha! Para ficção científica, recomendo "Dune" de Frank Herbert e "Neuromancer" de William Gibson. Baseado no seu perfil, você tem 94% de chance de gostar de Dune! 🚀';
  }

  if (mensagemLower.includes("romance")) {
    return 'Para romance, sugiro "Orgulho e Preconceito" de Jane Austen - um clássico atemporal! Também temos "Me Chame Pelo Seu Nome" que está bem avaliado. Que tipo de romance você prefere? 💕';
  }

  if (
    mensagemLower.includes("fantasia") ||
    mensagemLower.includes("harry potter")
  ) {
    return 'Se você gostou de Harry Potter, vai adorar "O Nome do Vento" de Patrick Rothfuss e "A Guerra dos Tronos" de George R.R. Martin. Ambos têm mundos ricos e personagens cativantes! ⚡';
  }

  if (mensagemLower.includes("biografia")) {
    return 'Biografias inspiradoras são ótimas! Recomendo "Steve Jobs" de Walter Isaacson e "Becoming" de Michelle Obama. Que tipo de personalidade te interessa mais? 📖';
  }

  if (mensagemLower.includes("preço") || mensagemLower.includes("barato")) {
    return 'Entendo! Temos ótimas opções com bom custo-benefício. "1984" por R$ 32,50 e "O Hobbit" por R$ 34,90 são excelentes escolhas! 💰';
  }

  if (mensagemLower.includes("avaliação") || mensagemLower.includes("nota")) {
    return 'Nossos livros mais bem avaliados são "O Nome do Vento" (4.8⭐) e "Dune" (4.7⭐). Ambos têm excelente feedback dos leitores! 📊';
  }

  // Respostas genéricas
  const respostasGenericas = [
    "Interessante! Com base no seu histórico, posso sugerir alguns livros que combinam com seus gostos. Que gênero você está procurando no momento?",
    "Ótima pergunta! Nossa IA analisou seus padrões e tem algumas sugestões personalizadas. Quer ver as recomendações mais recentes?",
    "Posso ajudar com isso! Baseado nas suas preferências anteriores, tenho algumas opções que você pode gostar. Prefere algo específico?",
    "Entendi seu interesse! Nossa biblioteca tem mais de 50.000 títulos. Posso filtrar por gênero, autor ou tema. O que prefere?",
  ];

  return respostasGenericas[
    Math.floor(Math.random() * respostasGenericas.length)
  ];
}

function enviarSugestao(texto) {
  const input = document.getElementById("chat-input");
  input.value = texto;
  enviarMensagem();
}

function verificarEnter(event) {
  if (event.key === "Enter") {
    enviarMensagem();
  }
}

function limparChat() {
  const chatWindow = document.getElementById("chat-window");
  if (!chatWindow) return;

  if (confirm("Deseja limpar toda a conversa?")) {
    chatWindow.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Conversa limpa! Como posso ajudá-lo hoje?</p>
                    <span class="message-time">${new Date().toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}</span>
                </div>
            </div>
        `;

    conversaChat = [
      {
        tipo: "bot",
        mensagem: "Conversa limpa! Como posso ajudá-lo hoje?",
        timestamp: new Date(),
      },
    ];
  }
}

function exportarConversa() {
  let texto = "CONVERSA COM ASSISTENTE IA - SISTEMA DE LIVROS\n";
  texto += "=" + "=".repeat(50) + "\n\n";

  conversaChat.forEach((msg) => {
    const tipo = msg.tipo === "bot" ? "ASSISTENTE" : "VOCÊ";
    const hora = msg.timestamp.toLocaleTimeString("pt-BR");
    texto += `[${hora}] ${tipo}: ${msg.mensagem}\n\n`;
  });

  const elemento = document.createElement("a");
  elemento.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(texto)
  );
  elemento.setAttribute(
    "download",
    `conversa_${new Date().toISOString().split("T")[0]}.txt`
  );
  elemento.style.display = "none";
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);

  mostrarNotificacao("Conversa exportada com sucesso!", "sucesso");
}

function avaliarAssistente() {
  const avaliacao = prompt(
    "Como você avalia nosso assistente IA?\n\n1 - Muito ruim\n2 - Ruim\n3 - Regular\n4 - Bom\n5 - Excelente\n\nDigite um número de 1 a 5:"
  );

  if (avaliacao >= 1 && avaliacao <= 5) {
    mostrarNotificacao(`Obrigado pela avaliação: ${avaliacao}⭐`, "sucesso");
  }
}

// ============================== FUNÇÕES DE HISTÓRICO E PREFERÊNCIAS ==============================

function mostrarTab(tabName) {
  // Remover classe active de todas as tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // Adicionar classe active na tab clicada
  event.target.classList.add("active");
  document.getElementById(tabName + "-tab").classList.add("active");

  // Carregar conteúdo específico da tab
  if (tabName === "historico") {
    carregarHistorico();
  }
}

function carregarHistorico() {
  const container = document.getElementById("historico-compras");
  if (!container) return;

  container.innerHTML = "";

  historicoCompras.forEach((item) => {
    const div = document.createElement("div");
    div.className = "historico-item";

    div.innerHTML = `
            <div class="livro-historico">
                <h4>${item.titulo}</h4>
                <p>por ${item.autor} • ${
      item.genero.charAt(0).toUpperCase() + item.genero.slice(1)
    }</p>
            </div>
            <div class="historico-meta">
                <div class="data-compra">${formatarData(item.dataCompra)}</div>
                <div class="avaliacao">${gerarEstrelas(item.avaliacao)}</div>
                <div class="preco">${formatarPreco(item.preco)}</div>
            </div>
        `;

    container.appendChild(div);
  });
}

function filtrarHistorico() {
  const periodo = document.getElementById("periodo-filter").value;
  const hoje = new Date();

  const itens = document.querySelectorAll(".historico-item");

  itens.forEach((item) => {
    const dataTexto = item.querySelector(".data-compra").textContent;
    // Para simplificar, vamos mostrar todos os itens
    item.style.display = "flex";
  });

  mostrarNotificacao(
    `Filtro de ${periodo} dias aplicado ao histórico.`,
    "info"
  );
}

function salvarPreferencias() {
  const generos = [];
  document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach((checkbox) => {
      generos.push(checkbox.value);
    });

  const tamanho = document.getElementById("tamanho-livro").value;
  const frequencia = document.getElementById("frequencia-rec").value;
  const orcamento = document.getElementById("orcamento").value;

  const preferencias = {
    generos: generos,
    tamanhoLivro: tamanho,
    frequenciaRecomendacoes: frequencia,
    orcamentoMensal: parseFloat(orcamento),
  };

  console.log("Preferências salvas:", preferencias);
  mostrarNotificacao(
    "Preferências salvas! A IA foi atualizada com seus novos gostos.",
    "sucesso"
  );

  // Simular retreinamento
  setTimeout(() => {
    mostrarNotificacao(
      "Modelo retreinado com suas novas preferências!",
      "info"
    );
  }, 2000);
}

function retreinarModelo() {
  const button = event.target;
  button.textContent = "🔄 Retreinando...";
  button.disabled = true;

  let progresso = 0;
  const interval = setInterval(() => {
    progresso += Math.random() * 20;

    if (progresso >= 100) {
      clearInterval(interval);
      button.textContent = "🧠 Retreinar Modelo";
      button.disabled = false;
      mostrarNotificacao(
        "Modelo retreinado com sucesso! Precisão atual: 95.2%",
        "sucesso"
      );
    } else {
      button.textContent = `🔄 Retreinando... ${Math.floor(progresso)}%`;
    }
  }, 500);
}

// ============================== FUNÇÕES DE NOTIFICAÇÃO ==============================

function mostrarNotificacao(mensagem, tipo = "info") {
  // Remover notificação existente
  const existente = document.querySelector(".notificacao");
  if (existente) {
    existente.remove();
  }

  const notificacao = document.createElement("div");
  notificacao.className = `notificacao notificacao-${tipo}`;

  const icones = {
    sucesso: "✅",
    erro: "❌",
    info: "ℹ️",
    aviso: "⚠️",
  };

  notificacao.innerHTML = `
        <span class="notificacao-icone">${icones[tipo] || "ℹ️"}</span>
        <span class="notificacao-texto">${mensagem}</span>
        <button class="notificacao-fechar" onclick="this.parentElement.remove()">×</button>
    `;

  // Adicionar estilos inline para a notificação
  Object.assign(notificacao.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor:
      tipo === "sucesso"
        ? "#4caf50"
        : tipo === "erro"
        ? "#f44336"
        : tipo === "aviso"
        ? "#ff9800"
        : "#2196f3",
    color: "white",
    padding: "15px 20px",
    borderRadius: "5px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: "1000",
    maxWidth: "400px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  });

  const fechar = notificacao.querySelector(".notificacao-fechar");
  Object.assign(fechar.style, {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    marginLeft: "auto",
  });

  document.body.appendChild(notificacao);

  // Auto remover após 5 segundos
  setTimeout(() => {
    if (notificacao.parentElement) {
      notificacao.remove();
    }
  }, 5000);
}

// ============================== INICIALIZAÇÃO ==============================

document.addEventListener("DOMContentLoaded", function () {
  // Carregar recomendações se estivermos na página de recomendações
  if (document.getElementById("recomendacoes-lista")) {
    carregarRecomendacoes();
  }

  // Carregar histórico se estivermos na página de histórico
  if (document.getElementById("historico-compras")) {
    carregarHistorico();
  }

  // Configurar primeira tab como ativa
  const primeiraTab = document.querySelector(".tab-btn");
  if (primeiraTab && !document.querySelector(".tab-btn.active")) {
    primeiraTab.classList.add("active");
    const primeiroContent = document.querySelector(".tab-content");
    if (primeiroContent) {
      primeiroContent.classList.add("active");
    }
  }

  // Animações de carregamento
  setTimeout(() => {
    document
      .querySelectorAll(".dashboard-card, .recomendacao-card, .activity-item")
      .forEach((elemento, index) => {
        elemento.style.animation = `fadeInUp 0.6s ease forwards ${
          index * 0.1
        }s`;
      });
  }, 100);
});

// Adicionar estilos de animação
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .dashboard-card, .recomendacao-card, .activity-item {
        opacity: 0;
    }
`;
document.head.appendChild(style);
