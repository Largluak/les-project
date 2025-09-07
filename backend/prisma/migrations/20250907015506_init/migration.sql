-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "clientCode" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneType" TEXT NOT NULL,
    "phoneDDD" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "residenceType" TEXT NOT NULL,
    "streetType" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "observations" TEXT,
    "isBilling" BOOLEAN NOT NULL DEFAULT false,
    "isDelivery" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "securityCode" TEXT NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_clientCode_key" ON "Client"("clientCode");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
