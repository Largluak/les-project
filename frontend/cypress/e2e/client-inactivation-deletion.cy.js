/// <reference types="cypress" />

describe("CRUD de Clientes - Inativação e Exclusão", () => {
  beforeEach(() => {
    cy.visit("/listarClientes.html");
    cy.waitForClientsList();
  });

  it("Deve inativar um cliente ativo", () => {
    // Encontrar o primeiro cliente ativo da lista
    cy.get("#tabelaClientes tbody tr").then(($rows) => {
      let clientFound = false;

      for (let i = 0; i < $rows.length && !clientFound; i++) {
        const $row = $rows.eq(i);
        const statusText = $row.find("td").eq(4).text().trim();

        if (statusText === "Ativo") {
          const clientName = $row.find("td").first().text().trim();

          // Validar se o nome não está vazio
          expect(clientName).to.not.be.empty;

          // Clicar no botão inativar
          cy.inactivateClient(clientName);

          // Verificar se a requisição foi feita
          cy.wait("@apiPatch");

          // Verificar mensagem de sucesso
          cy.on("window:alert", (str) => {
            expect(str).to.contain("inativado com sucesso");
          });

          // Verificar se o status foi alterado para Inativo
          cy.get("#tabelaClientes tbody tr")
            .contains(clientName)
            .parent()
            .within(() => {
              cy.get("td").eq(4).should("contain", "Inativo");
            });

          // Verificar se o botão mudou para "Ativar"
          cy.get("#tabelaClientes tbody tr")
            .contains(clientName)
            .parent()
            .within(() => {
              cy.get("button").should("contain", "Ativar");
            });

          clientFound = true;
        }
      }

      // Se não encontrou nenhum cliente ativo, criar um para teste
      if (!clientFound) {
        cy.log("Nenhum cliente ativo encontrado, pulando teste");
      }
    });
  });

  it("Deve ativar um cliente inativo", () => {
    // Encontrar o primeiro cliente inativo da lista
    cy.get("#tabelaClientes tbody tr").then(($rows) => {
      let clientFound = false;

      for (let i = 0; i < $rows.length && !clientFound; i++) {
        const $row = $rows.eq(i);
        const statusText = $row.find("td").eq(4).text().trim();

        if (statusText === "Inativo") {
          const clientName = $row.find("td").first().text().trim();

          // Validar se o nome não está vazio
          expect(clientName).to.not.be.empty;

          // Clicar no botão ativar
          cy.get("#tabelaClientes tbody tr")
            .contains(clientName)
            .parent()
            .find("button")
            .contains("Ativar")
            .click();

          // Verificar se a requisição foi feita
          cy.wait("@apiPatch");

          // Verificar mensagem de sucesso
          cy.on("window:alert", (str) => {
            expect(str).to.contain("ativado com sucesso");
          });

          // Verificar se o status foi alterado para Ativo
          cy.get("#tabelaClientes tbody tr")
            .contains(clientName)
            .parent()
            .within(() => {
              cy.get("td").eq(4).should("contain", "Ativo");
            });

          // Verificar se o botão mudou para "Inativar"
          cy.get("#tabelaClientes tbody tr")
            .contains(clientName)
            .parent()
            .within(() => {
              cy.get("button").should("contain", "Inativar");
            });

          clientFound = true;
        }
      }

      // Se não encontrou nenhum cliente inativo, criar um para teste
      if (!clientFound) {
        cy.log("Nenhum cliente inativo encontrado, pulando teste");
      }
    });
  });

  it("Deve remover um cliente permanentemente", () => {
    // Obter o primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão remover (fora do contexto within)
        cy.removeClient(clientName);

        // Verificar se o modal de confirmação apareceu
        cy.get("#modalConfirmacao").should("be.visible");
        cy.get("#modalConfirmacao").should("contain", "Remover Cliente");
        cy.get("#modalConfirmacao").should("contain", clientName);
        cy.get("#modalConfirmacao").should(
          "contain",
          "Esta ação não pode ser desfeita"
        );

        // Confirmar remoção
        cy.confirmModal();

        // Verificar se a requisição foi feita
        cy.wait("@apiDelete");

        // Verificar mensagem de sucesso
        cy.on("window:alert", (str) => {
          expect(str).to.contain("removido com sucesso");
        });

        // Aguardar um pouco para a página atualizar
        cy.wait(1000);

        // Recarregar a página para garantir que a lista seja atualizada
        cy.reload();
        cy.waitForClientsList();

        // Verificar se o cliente foi removido da lista
        cy.get("#tabelaClientes tbody tr").should("not.contain", clientName);
      });
  });

  it("Deve cancelar remoção de cliente", () => {
    // Obter o primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão remover (fora do contexto within)
        cy.removeClient(clientName);

        // Verificar se o modal de confirmação apareceu
        cy.get("#modalConfirmacao").should("be.visible");

        // Cancelar remoção
        cy.cancelModal();

        // Verificar se o modal fechou
        cy.get("#modalConfirmacao").should("not.exist");

        // Verificar se o cliente ainda está na lista
        cy.get("#tabelaClientes tbody tr").should("contain", clientName);
      });
  });

  it("Deve fechar modal de confirmação ao pressionar ESC", () => {
    // Obter o primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão remover (fora do contexto within)
        cy.removeClient(clientName);

        // Verificar se o modal de confirmação apareceu
        cy.get("#modalConfirmacao").should("be.visible");

        // Pressionar ESC
        cy.get("body").type("{esc}");

        // Verificar se o modal fechou
        cy.get("#modalConfirmacao").should("not.exist");

        // Verificar se o cliente ainda está na lista
        cy.get("#tabelaClientes tbody tr").should("contain", clientName);
      });
  });

  it("Deve mostrar modal de confirmação com informações corretas", () => {
    // Obter o primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão remover (fora do contexto within)
        cy.removeClient(clientName);

        // Verificar conteúdo do modal
        cy.get("#modalConfirmacao").within(() => {
          cy.get(".modal-header").should("contain", "Remover Cliente");
          cy.get(".modal-header").should("contain", "⚠️");
          cy.get(".mensagem-principal").should("contain", clientName);
          cy.get(".detalhes").should(
            "contain",
            "Esta ação não pode ser desfeita"
          );
          cy.get(".detalhes").should("contain", "todos os dados relacionados");
          cy.get(".btn-cancel").should("contain", "Cancelar");
          cy.get(".btn-danger").should("contain", "Sim, Remover");
        });
      });
  });

  it("Deve alternar entre ativo e inativo múltiplas vezes", () => {
    // Obter o primeiro cliente da lista
    cy.get("#tabelaClientes tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Primeira inativação
        cy.inactivateClient(clientName);
        cy.wait("@apiPatch");

        // Verificar status inativo
        cy.get("#tabelaClientes tbody tr")
          .contains(clientName)
          .parent()
          .within(() => {
            cy.get("td").eq(4).should("contain", "Inativo");
            cy.get("button").should("contain", "Ativar");
          });

        // Ativar novamente
        cy.get("#tabelaClientes tbody tr")
          .contains(clientName)
          .parent()
          .find("button")
          .contains("Ativar")
          .click();
        cy.wait("@apiPatch");

        // Verificar status ativo
        cy.get("#tabelaClientes tbody tr")
          .contains(clientName)
          .parent()
          .within(() => {
            cy.get("td").eq(4).should("contain", "Ativo");
            cy.get("button").should("contain", "Inativar");
          });
      });
  });

  it("Deve manter lista atualizada após operações", () => {
    // Contar clientes iniciais e executar operações dentro do mesmo contexto
    cy.get("#tabelaClientes tbody tr").then(($rows) => {
      const initialCount = $rows.length;

      // Verificar se há pelo menos um cliente
      expect(initialCount).to.be.greaterThan(0);

      // Inativar um cliente
      cy.get("#tabelaClientes tbody tr")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .then((clientName) => {
          expect(clientName).to.not.be.empty;
          cy.inactivateClient(clientName);
          cy.wait("@apiPatch");
        });

      // Verificar se a contagem permanece a mesma após inativação
      cy.get("#tabelaClientes tbody tr").should("have.length", initialCount);

      // Remover um cliente
      cy.get("#tabelaClientes tbody tr")
        .first()
        .find("td")
        .first()
        .invoke("text")
        .then((clientName) => {
          expect(clientName).to.not.be.empty;
          cy.removeClient(clientName);
          cy.confirmModal();
          cy.wait("@apiDelete");
        });

      // Aguardar um pouco e recarregar para garantir atualização
      cy.wait(1000);
      cy.reload();
      cy.waitForClientsList();

      // Verificar se a contagem diminuiu após remoção
      cy.get("#tabelaClientes tbody tr").should(
        "have.length",
        initialCount - 1
      );
    });
  });

  it("Deve mostrar mensagem quando não há clientes após remoção", () => {
    // Este teste seria executado removendo todos os clientes
    // ou em um ambiente limpo
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
});
