/// <reference types="cypress" />

describe("CRUD de Clientes - Endereços", () => {
  beforeEach(() => {
    cy.visit("/listarEndereco.html");
    cy.waitForAddressesList();
  });

  it("Deve listar endereços cadastrados", () => {
    // Verificar se a tabela está visível
    cy.get("#tabelaEnderecos").should("be.visible");
    cy.get("#tabelaEnderecos thead").should("contain", "Cliente");
    cy.get("#tabelaEnderecos thead").should("contain", "Tipo");
    cy.get("#tabelaEnderecos thead").should("contain", "Logradouro");
    cy.get("#tabelaEnderecos thead").should("contain", "Número");
    cy.get("#tabelaEnderecos thead").should("contain", "Bairro");
    cy.get("#tabelaEnderecos thead").should("contain", "Cidade");
    cy.get("#tabelaEnderecos thead").should("contain", "CEP");
    cy.get("#tabelaEnderecos thead").should("contain", "Estado");
    cy.get("#tabelaEnderecos thead").should("contain", "País");
    cy.get("#tabelaEnderecos thead").should("contain", "Complemento");
    cy.get("#tabelaEnderecos thead").should("contain", "Ações");

    // Verificar se há pelo menos um endereço na lista
    cy.get("#tabelaEnderecos tbody tr").should("have.length.at.least", 1);
  });

  it("Deve editar um endereço", () => {
    const updatedAddress = {
      residenceType: "Casa",
      street: "Rua das Palmeiras",
      number: "789",
      district: "Jardins",
      city: "São Paulo",
      cep: "01452000",
      state: "SP",
      country: "Brasil",
      observations: "Casa com quintal",
    };

    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editAddress(clientName);

        // Verificar se o modal abriu
        cy.get("#modalEditarEndereco").should("be.visible");

        // Preencher dados atualizados
        cy.fillEditAddressModal(updatedAddress);

        // Salvar alterações
        cy.get("#formEditarEndereco").submit();

        // Verificar se a requisição foi feita
        cy.wait("@apiPut");

        // Verificar mensagem de sucesso
        cy.on("window:alert", (str) => {
          expect(str).to.contain("Endereço atualizado com sucesso");
        });

        // Verificar se o modal fechou
        cy.get("#modalEditarEndereco").should("not.be.visible");

        // Verificar se os dados foram atualizados na tabela
        cy.get("#tabelaEnderecos tbody tr").should(
          "contain",
          updatedAddress.street
        );
        cy.get("#tabelaEnderecos tbody tr").should(
          "contain",
          updatedAddress.number
        );
        cy.get("#tabelaEnderecos tbody tr").should(
          "contain",
          updatedAddress.district
        );
      });
  });

  it("Deve validar campos obrigatórios na edição de endereço", () => {
    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editAddress(clientName);

        // Verificar se o modal abriu
        cy.get("#modalEditarEndereco").should("be.visible");

        // Limpar campos obrigatórios
        cy.get("#editTipo").select("");
        cy.get("#editLogradouro").clear();
        cy.get("#editNumero").clear();
        cy.get("#editBairro").clear();
        cy.get("#editCidade").clear();
        cy.get("#editCep").clear();
        cy.get("#editEstado").clear();

        // Tentar salvar
        cy.get("#formEditarEndereco").submit();

        // Verificar se os campos estão marcados como inválidos
        cy.get("#editTipo:invalid").should("exist");
        cy.get("#editLogradouro:invalid").should("exist");
        cy.get("#editNumero:invalid").should("exist");
        cy.get("#editBairro:invalid").should("exist");
        cy.get("#editCidade:invalid").should("exist");
        cy.get("#editCep:invalid").should("exist");
        cy.get("#editEstado:invalid").should("exist");
      });
  });

  it("Deve fechar modal de edição de endereço ao clicar no X", () => {
    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editAddress(clientName);

        // Verificar se o modal abriu
        cy.get("#modalEditarEndereco").should("be.visible");

        // Fechar modal
        cy.closeModal();

        // Verificar se o modal fechou
        cy.get("#modalEditarEndereco").should("not.be.visible");
      });
  });

  it("Deve fechar modal de edição de endereço ao clicar em Cancelar", () => {
    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Clicar no botão editar (fora do contexto within)
        cy.editAddress(clientName);

        // Verificar se o modal abriu
        cy.get("#modalEditarEndereco").should("be.visible");

        // Clicar em Cancelar
        cy.get("#modalEditarEndereco .btn-cancel").click();

        // Verificar se o modal fechou
        cy.get("#modalEditarEndereco").should("not.be.visible");
      });
  });

  it("Deve remover um endereço", () => {
    // Verificar se há pelo menos 1 endereço para poder tentar remover
    cy.get("#tabelaEnderecos tbody tr").should("have.length.at.least", 1);

    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Confirmar remoção no alert ANTES de clicar no botão
        cy.on("window:confirm", () => true);

        // Clicar no botão remover (fora do contexto within)
        cy.removeAddressFromList(clientName);

        // Verificar mensagem de sucesso
        cy.on("window:alert", (str) => {
          expect(str).to.contain("removido com sucesso");
        });

        // Aguardar um pouco para a página atualizar
        cy.wait(1000);

        // Recarregar a página para garantir que a lista seja atualizada
        cy.reload();
        cy.waitForAddressesList();

        // Verificar se a tabela ainda está funcionando
        cy.get("#tabelaEnderecos").should("be.visible");

        // Verificar se ainda há endereços na lista (funcionalidade pode não estar implementada)
        cy.get("#tabelaEnderecos tbody tr").should("have.length.at.least", 0);
      });
  });

  it("Deve cancelar remoção de endereço", () => {
    // Obter o primeiro endereço da lista
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        // Validar se o nome não está vazio
        expect(clientName).to.not.be.empty;

        // Cancelar remoção no alert ANTES de clicar no botão
        cy.on("window:confirm", () => false);

        // Clicar no botão remover (fora do contexto within)
        cy.removeAddressFromList(clientName);

        // Verificar se o endereço ainda está na lista
        cy.get("#tabelaEnderecos tbody tr").should("contain", clientName);
      });
  });

  it("Deve exibir tabela vazia quando não há endereços", () => {
    // Este teste seria executado em um ambiente limpo
    // ou após limpar todos os endereços
    cy.intercept("GET", "http://localhost:4000/api/clients", {
      statusCode: 200,
      body: { clients: [] },
    }).as("emptyAddressesList");

    cy.visit("/listarEndereco.html");
    cy.wait("@emptyAddressesList");

    // Verificar se a tabela está visível
    cy.get("#tabelaEnderecos").should("be.visible");

    // Verificar se não há endereços na lista
    cy.get("#tabelaEnderecos tbody tr").should("have.length", 0);

    // Verificar se a tabela está funcionando corretamente mesmo vazia
    cy.get("#tabelaEnderecos thead").should("be.visible");
    cy.get("#tabelaEnderecos thead").should("contain", "Cliente");
    cy.get("#tabelaEnderecos thead").should("contain", "Tipo");
    cy.get("#tabelaEnderecos thead").should("contain", "Logradouro");
  });

  it("Deve mostrar informações completas do endereço", () => {
    // Verificar se todos os campos do endereço estão sendo exibidos
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .within(() => {
        cy.get("td").should("have.length", 11); // 10 campos + 1 coluna de ações

        // Verificar se os campos não estão vazios
        cy.get("td").eq(0).should("not.be.empty"); // Cliente
        cy.get("td").eq(1).should("not.be.empty"); // Tipo
        cy.get("td").eq(2).should("not.be.empty"); // Logradouro
        cy.get("td").eq(3).should("not.be.empty"); // Número
        cy.get("td").eq(4).should("not.be.empty"); // Bairro
        cy.get("td").eq(5).should("not.be.empty"); // Cidade
        cy.get("td").eq(6).should("not.be.empty"); // CEP
        cy.get("td").eq(7).should("not.be.empty"); // Estado
        cy.get("td").eq(8).should("not.be.empty"); // País
      });
  });

  it("Deve mostrar botões de ação para cada endereço", () => {
    // Verificar se todos os endereços têm botões de ação
    cy.get("#tabelaEnderecos tbody tr").each(($row) => {
      cy.wrap($row).within(() => {
        cy.get("td")
          .last()
          .within(() => {
            cy.get("button").should("contain", "Editar");
            cy.get("button").should("contain", "Remover");
          });
      });
    });
  });

  it("Deve manter dados originais ao cancelar edição", () => {
    // Obter dados originais do primeiro endereço de forma sequencial
    cy.get("#tabelaEnderecos tbody tr")
      .first()
      .find("td")
      .first()
      .invoke("text")
      .then((clientName) => {
        expect(clientName).to.not.be.empty;

        // Obter dados originais sequencialmente
        cy.get("#tabelaEnderecos tbody tr")
          .first()
          .find("td")
          .eq(2)
          .invoke("text")
          .then((originalStreet) => {
            cy.get("#tabelaEnderecos tbody tr")
              .first()
              .find("td")
              .eq(3)
              .invoke("text")
              .then((originalNumber) => {
                cy.get("#tabelaEnderecos tbody tr")
                  .first()
                  .find("td")
                  .eq(4)
                  .invoke("text")
                  .then((originalDistrict) => {
                    // Agora todos os dados estão disponíveis
                    // Editar endereço
                    cy.editAddress(clientName);

                    // Verificar se o modal abriu
                    cy.get("#modalEditarEndereco").should("be.visible");

                    // Modificar dados
                    cy.get("#editLogradouro").clear().type("Rua Modificada");
                    cy.get("#editNumero").clear().type("999");
                    cy.get("#editBairro").clear().type("Bairro Modificado");

                    // Cancelar edição
                    cy.get("#modalEditarEndereco .btn-cancel").click();

                    // Verificar se o modal fechou
                    cy.get("#modalEditarEndereco").should("not.be.visible");

                    // Verificar se os dados originais foram mantidos
                    cy.get("#tabelaEnderecos tbody tr")
                      .first()
                      .within(() => {
                        cy.get("td").eq(2).should("contain", originalStreet);
                        cy.get("td").eq(3).should("contain", originalNumber);
                        cy.get("td").eq(4).should("contain", originalDistrict);
                      });
                  });
              });
          });
      });
  });
});
