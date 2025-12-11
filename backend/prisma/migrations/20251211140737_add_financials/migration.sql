-- CreateTable
CREATE TABLE "company_financials" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "cashBalance" DECIMAL(15,2) NOT NULL,
    "monthlyRevenue" DECIMAL(15,2) NOT NULL,
    "monthlyExpenses" DECIMAL(15,2) NOT NULL,
    "totalTaxLiability" DECIMAL(15,2) NOT NULL,
    "overdueDebts" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_financials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_financials_companyId_key" ON "company_financials"("companyId");

-- AddForeignKey
ALTER TABLE "company_financials" ADD CONSTRAINT "company_financials_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
