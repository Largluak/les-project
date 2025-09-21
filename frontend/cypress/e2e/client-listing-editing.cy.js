/// <reference types="cypress" />

describe("CRUD de Clientes - Listagem e Edição", () => {
  beforeEach(() => {
    cy.visit("/listarClientes.html");
    cy.waitForClientsList();
  });

  it("Deve listar clientes cadastrados", () => {
    // Verificar se a tabela está visível
    cy.get("#tabelaClientes").should("be.visible");
    cy.get("#tabelaClientes thead").should("contain", "Nome");
    cy.get("#tabelaClientes thead").should("contain", "Email");
    cy.get("#tabelaClientes thead").should("contain", "Telefone");
    cy.get("#tabelaClientes thead").should("contain", "Ranking");
    cy.get("#tabelaClientes thead").should("contain", "Status");
    cy.get("#tabelaClientes thead").should("contain", "Ações");

    // Verificar se há pelo menos um cliente na lista
    cy.get("#tabelaClientes tbody tr").should("have.length.at.least", 1);
  });

  it("Deve filtrar clientes por nome", () => {
    // Aguardar a página carregar completamente
    cy.get("#tabelaClientes tbody tr").should("have.length.at.least", 1);

    // Aguardar os campos de filtro estarem disponíveis
    cy.get("#filtroNome").should("be.visible");
    cy.get("#filtroEmail").should("be.visible");

    // Obter o nome do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Filtrar por nome
        cy.filterClients(clientName, "");

        // Verificar se apenas o cliente filtrado aparece
        cy.get("#tabelaClientes tbody tr").should("have.length", 1);
        cy.get("#tabelaClientes tbody tr").should("contain", clientName);
      });
  });

  it("Deve filtrar clientes por email", () => {
    // Aguardar a página carregar completamente
    cy.get("#tabelaClientes tbody tr").should("have.length.at.least", 1);

    // Aguardar os campos de filtro estarem disponíveis
    cy.get("#filtroNome").should("be.visible");
    cy.get("#filtroEmail").should("be.visible");

    // Obter o email do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .eq(1)
      .invoke("text")
      .then((clientEmail) => {
        // Filtrar por email
        cy.filterClients("", clientEmail);

        // Verificar se apenas o cliente filtrado aparece
        cy.get("#tabelaClientes tbody tr").should("have.length", 1);
        cy.get("#tabelaClientes tbody tr").should("contain", clientEmail);
      });
  });

  it("Deve filtrar clientes por nome e email", () => {
    // Aguardar a página carregar completamente
    cy.get("#tabelaClientes tbody tr").should("have.length.at.least", 1);

    // Aguardar os campos de filtro estarem disponíveis
    cy.get("#filtroNome").should("be.visible");
    cy.get("#filtroEmail").should("be.visible");

    // Obter nome e email do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        cy.get("#tabelaClientes tbody tr")
          .first()
          .find("td")
          .eq(1)
          .invoke("text")
          .then((clientEmail) => {
            // Filtrar por nome e email
            cy.filterClients(clientName, clientEmail);

            // Verificar se apenas o cliente filtrado aparece
            cy.get("#tabelaClientes tbody tr").should("have.length", 1);
            cy.get("#tabelaClientes tbody tr").should("contain", clientName);
            cy.get("#tabelaClientes tbody tr").should("contain", clientEmail);
          });
      });
  });

  it("Deve editar dados de um cliente", () => {
    const updatedData = {
      name: "João Silva Santos Atualizado",
      email: "joao.atualizado@email.com",
      phone: "11999888777",
      ranking: "5",
      status: "Ativo",
    };

    // Obter o nome do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editClient(clientName);

        // Verificar se o modal abriu
        cy.get("#modalCliente").should("be.visible");

        // Preencher dados atualizados
        cy.fillEditClientModal(updatedData);

        // Salvar alterações
        cy.get("#formEditarCliente").submit();

        // Verificar se a requisição foi feita
        cy.wait("@apiPut");

        // Verificar mensagem de sucesso
        cy.on("window:alert", (str) => {
          expect(str).to.contain("Cliente atualizado com sucesso");
        });

        // Verificar se o modal fechou
        cy.get("#modalCliente").should("not.be.visible");

        // Verificar se os dados foram atualizados na tabela
        cy.get("#tabelaClientes tbody tr").should("contain", updatedData.name);
        cy.get("#tabelaClientes tbody tr").should("contain", updatedData.email);
      });
  });

  it("Deve validar campos obrigatórios na edição", () => {
    // Interceptar requisições PUT para garantir que não sejam feitas durante a validação
    cy.intercept("PUT", "http://localhost:4000/api/clients/**").as(
      "putRequest"
    );

    // Obter o nome do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editClient(clientName);

        // Verificar se o modal abriu
        cy.get("#modalCliente").should("be.visible");

        // Limpar campos obrigatórios
        cy.get("#editNome").clear();
        cy.get("#editEmail").clear();
        cy.get("#editTelefone").clear();

        // Tentar clicar no botão de salvar para acionar a validação do frontend
        cy.get("#formEditarCliente button[type='submit']").click();

        // Verificar se os campos estão marcados como inválidos
        cy.get("#editNome:invalid").should("exist");
        cy.get("#editEmail:invalid").should("exist");
        cy.get("#editTelefone:invalid").should("exist");

        // Fechar o modal sem salvar as alterações
        cy.closeModal();
        cy.get("#modalCliente").should("not.be.visible");

        // Verificar que nenhuma requisição PUT foi feita durante a validação
        cy.get("@putRequest.all").should("have.length", 0);
      });
  });

  it("Deve manter dados originais após teste de validação", () => {
    // Obter o nome do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((originalName) => {
        // Validar se o nome não está vazio
        expect(originalName).to.not.be.empty;

        // Obter o email original também
        cy.get("#tabelaClientes tbody tr")
          .first()
          .find("td")
          .eq(1)
          .invoke("text")
          .then((originalEmail) => {
            // Validar se o email não está vazio
            expect(originalEmail).to.not.be.empty;

            // Clicar no botão editar
            cy.editClient(originalName);

            // Verificar se o modal abriu
            cy.get("#modalCliente").should("be.visible");

            // Limpar campos obrigatórios
            cy.get("#editNome").clear();
            cy.get("#editEmail").clear();
            cy.get("#editTelefone").clear();

            // Tentar clicar no botão de salvar para acionar a validação do frontend
            cy.get("#formEditarCliente button[type='submit']").click();

            // Verificar se os campos estão marcados como inválidos
            cy.get("#editNome:invalid").should("exist");
            cy.get("#editEmail:invalid").should("exist");
            cy.get("#editTelefone:invalid").should("exist");

            // Fechar o modal sem salvar as alterações
            cy.closeModal();
            cy.get("#modalCliente").should("not.be.visible");

            // Verificar se os dados originais ainda estão na tabela
            cy.get("#tabelaClientes tbody tr")
              .should("contain", originalName)
              .and("contain", originalEmail);
          });
      });
  });

  it("Deve fechar modal de edição ao clicar no X", () => {
    // Obter o nome do primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editClient(clientName);

        // Verificar se o modal abriu
        cy.get("#modalCliente").should("be.visible");

        // Fechar modal
        cy.closeModal();

        // Verificar se o modal fechou
        cy.get("#modalCliente").should("not.be.visible");
      });
  });

  it("Deve mostrar mensagem quando não há clientes", () => {
    // Este teste seria executado em um ambiente limpo
    // ou após limpar todos os clientes
    cy.intercept("GET", "http://localhost:4000/api/clients", {
      statusCode: 200,
      body: { clients: [] },
    }).as("emptyClientsList");

    cy.visit("/listarClientes.html");
    cy.wait("@emptyClientsList");

    // Verificar mensagem de lista vazia
    cy.get("#tabelaClientes tbody tr").should(
      "contain",
      "Nenhum cliente encontrado"
    );
  });

  it("Deve mostrar status correto dos clientes", () => {
    // Verificar se há clientes ativos e inativos na lista
    cy.get("#tabelaClientes tbody tr").each(($row) => {
      cy.wrap($row).within(() => {
        cy.get("td")
          .eq(4)
          .should(($status) => {
            const statusText = $status.text().trim();
            expect(statusText).to.match(/^(Ativo|Inativo)$/);
          });
      });
    });
  });

  it("Deve mostrar ranking dos clientes", () => {
    // Verificar se todos os clientes têm ranking
    cy.get("#tabelaClientes tbody tr").each(($row) => {
      cy.wrap($row).within(() => {
        cy.get("td").eq(3).should("not.be.empty");
      });
    });
  });
});
