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
let carrinho = [];

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

function mostrarTab(tabName) {
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
    carregarVendasAdmin();
  } else if (tipo === "trocas") {
    carregarTrocasAdmin();
  } else if (tipo === "entregas") {
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
