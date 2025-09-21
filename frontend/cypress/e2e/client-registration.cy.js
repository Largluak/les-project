/// <reference types="cypress" />

describe("CRUD de Clientes - Cadastro", () => {
  beforeEach(() => {
    cy.visit("/cadastrarClientes.html");
  });

  it("Deve cadastrar um cliente com um endereço de cobrança e um de entrega", () => {
    const clientData = Cypress.env("testData")?.clients?.validClient || {
      name: "João Silva Santos",
      gender: "Masculino",
      birthDate: "1990-05-15",
      cpf: "93092607775",
      phone: "11987654321",
      email: "joao.silva@email.com",
      password: "MinhaSenh@123",
      passwordConfirm: "MinhaSenh@123",
    };

    const billingAddress = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      observations: "Casa térrea",
      isBilling: true,
      isDelivery: false,
    };

    const deliveryAddress = {
      residenceType: "Apartamento",
      streetType: "Avenida",
      street: "Avenida Paulista",
      number: "1000",
      district: "Bela Vista",
      cep: "01310100",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      observations: "Apartamento 45",
      isBilling: false,
      isDelivery: true,
    };

    // Preencher dados pessoais
    cy.fillClientPersonalData(clientData);

    // Preencher primeiro endereço (cobrança)
    cy.fillAddressData(billingAddress, 1);

    // Adicionar segundo endereço
    cy.addNewAddress();

    // Preencher segundo endereço (entrega)
    cy.fillAddressData(deliveryAddress, 2);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar se a requisição foi feita
    cy.wait("@apiPost");

    // Verificar mensagem de sucesso (assumindo que há um alert ou notificação)
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Cliente cadastrado com sucesso");
    });
  });

  it("Deve cadastrar um cliente com múltiplos endereços", () => {
    const clientData = {
      name: "Maria Oliveira Costa",
      gender: "Feminino",
      birthDate: "1985-08-22",
      cpf: "98765432100",
      phone: "11912345678",
      email: "maria.oliveira@email.com",
      password: "SenhaSegur@456",
      passwordConfirm: "SenhaSegur@456",
    };

    const address1 = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: true,
      isDelivery: false,
    };

    const address2 = {
      residenceType: "Apartamento",
      streetType: "Avenida",
      street: "Avenida Paulista",
      number: "1000",
      district: "Bela Vista",
      cep: "01310100",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: false,
      isDelivery: true,
    };

    const address3 = {
      residenceType: "Sobrado",
      streetType: "Rua",
      street: "Rua da Consolação",
      number: "456",
      district: "Consolação",
      cep: "01302000",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: true,
      isDelivery: true,
    };

    // Preencher dados pessoais
    cy.fillClientPersonalData(clientData);

    // Preencher primeiro endereço
    cy.fillAddressData(address1, 1);

    // Adicionar segundo endereço
    cy.addNewAddress();
    cy.fillAddressData(address2, 2);

    // Adicionar terceiro endereço
    cy.addNewAddress();
    cy.fillAddressData(address3, 3);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar se a requisição foi feita
    cy.wait("@apiPost");

    // Verificar mensagem de sucesso
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Cliente cadastrado com sucesso");
    });
  });

  it("Deve validar campos obrigatórios", () => {
    // Tentar submeter formulário vazio
    cy.get("#formCadastrarCliente").submit();

    // Verificar se os campos obrigatórios estão marcados como inválidos
    cy.get("#nome:invalid").should("exist");
    cy.get("#genero:invalid").should("exist");
    cy.get("#nascimento:invalid").should("exist");
    cy.get("#cpf:invalid").should("exist");
    cy.get("#telefone:invalid").should("exist");
    cy.get("#email:invalid").should("exist");
    cy.get("#senha:invalid").should("exist");
    cy.get("#confirmarSenha:invalid").should("exist");
  });

  it("Deve validar CPF inválido", () => {
    const clientData = {
      name: "João Silva Santos",
      gender: "Masculino",
      birthDate: "1990-05-15",
      cpf: "12345678901", // CPF inválido
      phone: "11987654321",
      email: "joao.silva@email.com",
      password: "MinhaSenh@123",
      passwordConfirm: "MinhaSenh@123",
    };

    cy.fillClientPersonalData(clientData);

    // Preencher pelo menos um endereço
    const address = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: true,
      isDelivery: true,
    };

    cy.fillAddressData(address, 1);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar mensagem de erro
    cy.on("window:alert", (str) => {
      expect(str).to.contain("CPF inválido");
    });
  });

  it("Deve validar senhas diferentes", () => {
    const clientData = {
      name: "João Silva Santos",
      gender: "Masculino",
      birthDate: "1990-05-15",
      cpf: "12345678901",
      phone: "11987654321",
      email: "joao.silva@email.com",
      password: "MinhaSenh@123",
      passwordConfirm: "SenhaDiferente@456", // Senhas diferentes
    };

    cy.fillClientPersonalData(clientData);

    // Preencher pelo menos um endereço
    const address = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: true,
      isDelivery: true,
    };

    cy.fillAddressData(address, 1);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar mensagem de erro
    cy.on("window:alert", (str) => {
      expect(str).to.contain("Senhas não coincidem");
    });
  });

  it("Deve validar obrigatoriedade de endereço de cobrança", () => {
    const clientData = {
      name: "João Silva Santos",
      gender: "Masculino",
      birthDate: "1990-05-15",
      cpf: "12345678901",
      phone: "11987654321",
      email: "joao.silva@email.com",
      password: "MinhaSenh@123",
      passwordConfirm: "MinhaSenh@123",
    };

    cy.fillClientPersonalData(clientData);

    // Preencher endereço apenas de entrega (sem cobrança)
    const address = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: false, // Sem cobrança
      isDelivery: true,
    };

    cy.fillAddressData(address, 1);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar mensagem de erro
    cy.on("window:alert", (str) => {
      expect(str).to.contain("endereço de cobrança");
    });
  });

  it("Deve validar obrigatoriedade de endereço de entrega", () => {
    const clientData = {
      name: "João Silva Santos",
      gender: "Masculino",
      birthDate: "1990-05-15",
      cpf: "12345678901",
      phone: "11987654321",
      email: "joao.silva@email.com",
      password: "MinhaSenh@123",
      passwordConfirm: "MinhaSenh@123",
    };

    cy.fillClientPersonalData(clientData);

    // Preencher endereço apenas de cobrança (sem entrega)
    const address = {
      residenceType: "Casa",
      streetType: "Rua",
      street: "Rua das Flores",
      number: "123",
      district: "Centro",
      cep: "01234567",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      isBilling: true,
      isDelivery: false, // Sem entrega
    };

    cy.fillAddressData(address, 1);

    // Submeter formulário
    cy.get("#formCadastrarCliente").submit();

    // Verificar mensagem de erro
    cy.on("window:alert", (str) => {
      expect(str).to.contain("endereço de entrega");
    });
  });

  it("Deve permitir adicionar e remover endereços dinamicamente", () => {
    // Verificar que inicialmente há apenas 1 endereço
    cy.get(".endereco-item").should("have.length", 1);
    cy.get('[data-endereco="1"] .btn-remove-endereco').should("not.be.visible");

    // Adicionar segundo endereço
    cy.addNewAddress();
    cy.get(".endereco-item").should("have.length", 2);
    cy.get('[data-endereco="1"] .btn-remove-endereco').should("be.visible");

    // Adicionar terceiro endereço
    cy.addNewAddress();
    cy.get(".endereco-item").should("have.length", 3);

    // Remover segundo endereço
    cy.removeAddress(2);
    cy.get(".endereco-item").should("have.length", 2);

    // Verificar se a numeração foi atualizada
    cy.get('[data-endereco="1"] h4').should("contain", "Endereço 1");
    cy.get('[data-endereco="2"] h4').should("contain", "Endereço 2");
  });
});




