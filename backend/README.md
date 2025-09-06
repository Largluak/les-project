# EconoFlow Backend (Node.js + Prisma + PostgreSQL)

## Requisitos

- Node.js 18+
- Postgres
- npm

## Setup

1. Copie `.env.example` para `.env` e ajuste DATABASE_URL.
2. Instale dependências:
   npm install
3. Gere Prisma Client:
   npx prisma generate
4. Rode migração inicial (Cria as tabelas):
   npx prisma migrate dev --name init
5. Rode em dev:
   npm run dev

## Endpoints principais

- POST /api/clients
- GET /api/clients
- GET /api/clients/:id
- PUT /api/clients/:id
- PATCH /api/clients/:id/password
- PATCH /api/clients/:id/inactivate
- POST /api/clients/:id/addresses
- PUT /api/clients/:id/addresses/:addrId
- POST /api/clients/:id/cards
- PATCH /api/clients/:id/cards/:cardId/prefer
- GET /api/clients/:id/transactions

## Observações de segurança

- Não armazene CVV/numero de cartão em produção; utilize tokenização (PCI-DSS).
- Use HTTPS em produção.
