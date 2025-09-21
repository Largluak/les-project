# Testes E2E com Cypress - CRUD de Clientes

Este projeto contém testes automatizados End-to-End (E2E) para o sistema de CRUD de clientes, utilizando o Cypress como ferramenta de teste.

## 📋 Funcionalidades Testadas

### ✅ Cadastro de Clientes

- Cadastro com dados pessoais completos
- Cadastro com múltiplos endereços
- Validação de campos obrigatórios
- Validação de CPF
- Validação de senhas
- Validação de endereços obrigatórios (cobrança e entrega)
- Adição e remoção dinâmica de endereços

### ✅ Listagem e Edição de Clientes

- Listagem de clientes cadastrados
- Filtros por nome e email
- Edição de dados do cliente
- Validação de campos na edição
- Modais de edição

### ✅ Gerenciamento de Endereços

- Listagem de endereços
- Edição de endereços
- Remoção de endereços
- Validação de campos obrigatórios
- Modais de edição

### ✅ Inativação e Exclusão de Clientes

- Inativação de clientes ativos
- Ativação de clientes inativos
- Remoção permanente de clientes
- Modais de confirmação
- Alternância de status

## 🚀 Como Executar os Testes

### Pré-requisitos

1. **Backend rodando**: Certifique-se de que o backend está rodando em `http://localhost:4000`
2. **Frontend rodando**: Certifique-se de que o frontend está rodando em `http://localhost:3000` (ou ajuste a `baseUrl` no `cypress.config.js`)
3. **Node.js**: Versão 18+ (recomendado 20+)

### Instalação

```bash
# Navegar para o diretório frontend
cd frontend

# Instalar dependências (se ainda não foi feito)
npm install
```

### Executar Testes

#### 1. Interface Gráfica do Cypress (Recomendado para desenvolvimento)

```bash
npm run test:open
```

- Abre a interface gráfica do Cypress
- Permite executar testes individualmente
- Mostra execução em tempo real
- Ideal para debug e desenvolvimento

#### 2. Execução em Linha de Comando

```bash
# Executar todos os testes (modo headless)
npm test

# Executar com interface gráfica visível
npm run test:headed

# Executar em navegador específico
npm run test:chrome
npm run test:firefox
npm run test:edge
```

#### 3. Executar Testes Específicos

```bash
# Executar apenas testes de cadastro
npx cypress run --spec "cypress/e2e/client-registration.cy.js"

# Executar apenas testes de listagem
npx cypress run --spec "cypress/e2e/client-listing-editing.cy.js"

# Executar apenas testes de endereços
npx cypress run --spec "cypress/e2e/client-addresses.cy.js"

# Executar apenas testes de inativação/exclusão
npx cypress run --spec "cypress/e2e/client-inactivation-deletion.cy.js"
```

## 📁 Estrutura dos Testes

```
frontend/
├── cypress/
│   ├── e2e/                           # Testes E2E
│   │   ├── client-registration.cy.js  # Testes de cadastro
│   │   ├── client-listing-editing.cy.js # Testes de listagem e edição
│   │   ├── client-addresses.cy.js     # Testes de endereços
│   │   └── client-inactivation-deletion.cy.js # Testes de inativação/exclusão
│   ├── fixtures/                      # Dados de teste
│   │   └── testData.json              # Dados mockados para os testes
│   ├── support/                       # Configurações e comandos
│   │   ├── e2e.js                     # Configuração global
│   │   └── commands.js                # Comandos personalizados
│   └── config.js                      # Configuração do Cypress
├── cypress.config.js                  # Configuração principal
└── package.json                       # Scripts e dependências
```

## 🔧 Configuração

### Arquivo `cypress.config.js`

```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // URL do frontend
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
});
```

### Comandos Personalizados

Os testes utilizam comandos personalizados criados em `cypress/support/commands.js`:

- `fillClientPersonalData()` - Preenche dados pessoais do cliente
- `fillAddressData()` - Preenche dados de endereço
- `addNewAddress()` - Adiciona novo endereço
- `removeAddress()` - Remove endereço
- `navigateToPage()` - Navega para página específica
- `filterClients()` - Filtra clientes
- `editClient()` - Edita cliente
- `inactivateClient()` - Inativa cliente
- `removeClient()` - Remove cliente
- `editAddress()` - Edita endereço
- `removeAddressFromList()` - Remove endereço da lista
- `confirmModal()` - Confirma modal
- `cancelModal()` - Cancela modal
- `closeModal()` - Fecha modal

## 📊 Relatórios e Evidências

### Vídeos

- Os testes gravam vídeos automaticamente das execuções
- Salvos em `cypress/videos/`

### Screenshots

- Screenshots são capturados quando testes falham
- Salvos em `cypress/screenshots/`

### Relatórios HTML

```bash
# Gerar relatório HTML (requer plugin adicional)
npx cypress run --reporter html
```

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Backend não está rodando

```
Error: connect ECONNREFUSED 127.0.0.1:4000
```

**Solução**: Inicie o backend antes de executar os testes

#### 2. Frontend não está rodando

```
Error: ERR_CONNECTION_REFUSED
```

**Solução**: Inicie o frontend ou ajuste a `baseUrl` no `cypress.config.js`

#### 3. Timeout nos testes

```
Error: Timed out after waiting 10000ms
```

**Solução**: Aumente o timeout no `cypress.config.js` ou verifique se a aplicação está respondendo

#### 4. Elementos não encontrados

```
Error: cy.get() failed because the element was not found
```

**Solução**: Verifique se os seletores estão corretos e se a página carregou completamente

### Debug

```bash
# Executar com debug habilitado
DEBUG=cypress:* npm run test:open

# Executar teste específico com debug
npx cypress run --spec "cypress/e2e/client-registration.cy.js" --headed
```

## 📝 Dados de Teste

Os dados de teste estão em `cypress/fixtures/testData.json` e incluem:

- **Clientes válidos**: Dados completos para cadastro
- **Clientes inválidos**: Dados para testar validações
- **Endereços**: Diferentes tipos de endereços (cobrança, entrega, múltiplos propósitos)
- **Dados de edição**: Dados para testar atualizações

## 🔄 Integração Contínua

### GitHub Actions (Exemplo)

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "20"
      - run: cd frontend && npm install
      - run: cd backend && npm install && npm start &
      - run: cd frontend && npm run test
```

## 📈 Melhorias Futuras

- [ ] Adicionar testes de performance
- [ ] Implementar testes de acessibilidade
- [ ] Adicionar testes de responsividade
- [ ] Criar testes de integração com banco de dados
- [ ] Implementar relatórios de cobertura
- [ ] Adicionar testes de API diretos
- [ ] Implementar testes de regressão visual

## 🤝 Contribuição

Para adicionar novos testes:

1. Crie o arquivo de teste em `cypress/e2e/`
2. Use os comandos personalizados quando possível
3. Adicione dados de teste em `cypress/fixtures/testData.json`
4. Documente novos comandos em `cypress/support/commands.js`
5. Execute os testes antes de fazer commit

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique se o backend e frontend estão rodando
2. Consulte os logs do Cypress
3. Execute os testes com `--headed` para ver a execução
4. Verifique a documentação oficial do Cypress: https://docs.cypress.io/




