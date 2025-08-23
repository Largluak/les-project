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
        observacoes: "",
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
        observacoes: "",
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
        observacoes: "",
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
        observacoes: "",
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
  clientes.forEach((c, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.nome}</td>
      <td>${c.email}</td>
      <td>${c.telefone}</td>
      <td>${c.ranking}</td>
      <td>${c.status}</td>
      <td>
        <button class="btn-neutral" onclick="editarCliente(${index})">Editar</button>
        <button class="${
          c.status === "Ativo" ? "btn-cancel" : "btn-confirm"
        }" onclick="inativarCliente(${index})">${
      c.status === "Ativo" ? "Inativar" : "Ativar"
    }</button>
      </td>
    `;
    tabela.appendChild(row);
  });
}

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
          <button onclick="editarCliente(${index})">Editar</button>
          <button onclick="inativarCliente(${index})">${
        c.status === "Ativo" ? "Inativar" : "Ativar"
      }</button>
        </td>
      `;
      tabela.appendChild(row);
    }
  });
}

/**********************************
 * EDITAR / INATIVAR CLIENTE
 **********************************/
function editarCliente(index) {
  alert("Função de editar cliente ainda será implementada para mock.");
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
  clientes[0].enderecos.forEach((e, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.tipo}</td>
      <td>${e.logradouro}</td>
      <td>${e.numero}</td>
      <td>${e.bairro}</td>
      <td>${e.cidade}</td>
      <td>${e.cep}</td>
      <td>${e.estado}</td>
      <td>${e.pais}</td>
      <td>${e.observacoes}</td>
      <td><button class='btn-cancel' onclick="removerEndereco(${index})">Remover</button></td>
    `;
    tabela.appendChild(row);
  });
}

function removerEndereco(index) {
  clientes[0].enderecos.splice(index, 1);
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
  clientes[0].cartoes.forEach((c, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.numero}</td>
      <td>${c.nome}</td>
      <td>${c.bandeira}</td>
      <td>${c.codigo}</td>
      <td>${c.preferencial ? "Sim" : "Não"}</td>
      <td><button class='btn-cancel' onclick="removerCartao(${index})">Remover</button></td>
    `;
    tabela.appendChild(row);
  });
}

function removerCartao(index) {
  clientes[0].cartoes.splice(index, 1);
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
    (a, b) => (a.ranking > b.ranking ? a : b),
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
