import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFinancialsDto } from './dto/update-financials.dto';
import { Prisma } from '@prisma/client';

export interface ScoreComponents {
    liquidity: number;
    profitability: number;
    operational: number;
    taxRisk: number;
}

export interface FinanceScoreResult {
    overallScore: number;
    components: ScoreComponents;
    insights: string[];
}

@Injectable()
export class FinanceService {

    constructor(private readonly prisma: PrismaService) { }

    async updateFinancials(companyId: string, data: UpdateFinancialsDto) {
        return this.prisma.companyFinancials.upsert({
            where: { companyId },
            create: {
                companyId,
                ...data
            },
            update: {
                ...data
            }
        });
    }

    async getFinancials(companyId: string) {
        return this.prisma.companyFinancials.findUnique({
            where: { companyId }
        });
    }

    async calculateScore(companyId: string): Promise<FinanceScoreResult> {
        let financials = await this.prisma.companyFinancials.findUnique({ where: { companyId } });

        // Default or Mock data if no user input yet
        if (!financials) {
            financials = {
                id: 'mock',
                companyId: companyId,
                cashBalance: new Prisma.Decimal(50000),
                monthlyRevenue: new Prisma.Decimal(50000),
                monthlyExpenses: new Prisma.Decimal(20000),
                totalTaxLiability: new Prisma.Decimal(5000),
                overdueDebts: new Prisma.Decimal(0),
                updatedAt: new Date(),
                createdAt: new Date()
            } as any; // Type assertion to bypass partial match
        }

        const cashAvailable = Number(financials.cashBalance);
        const monthlyExpenses = Number(financials.monthlyExpenses);
        const monthlyRevenue = Number(financials.monthlyRevenue);
        const totalTax = Number(financials.totalTaxLiability);

        // Derived metrics
        const netProfit = monthlyRevenue - monthlyExpenses;
        const netMargin = monthlyRevenue > 0 ? netProfit / monthlyRevenue : 0;

        // Hardcoded simulation for things not in input yet (Delinquency, etc.)
        const delinquencyRate = 2;
        const salesInstability = 10;
        const unprovisionedTax = totalTax * 0.1; // Assume 10% risky

        // 1. Liquidity Score: Runway in months. 6 months = 100.
        // (Cash / Expenses) = months. 
        // Score = (months / 6) * 100.
        const runway = monthlyExpenses > 0 ? cashAvailable / monthlyExpenses : 0;
        const liquidityScore = Math.min(100, (runway / 6) * 100);

        // 2. Profitability Score
        // Net Margin 30% = 100 score.
        // Score = (margin / 0.30) * 100.
        const profitabilityScore = Math.min(100, Math.max(0, (netMargin / 0.30) * 100));

        // 3. Operational Score (Keep manual/mock logic for now as we lack inputs)
        const operationalScore = Math.max(0, 100 - (delinquencyRate * 2 + salesInstability));

        // 4. Tax Risk Score
        // If tax liability is high relative to revenue? 
        // Let's keep simple: 100 - (RiskyTax / Revenue * 100)
        const taxRiskScore = Math.max(0, 100 - ((unprovisionedTax / (monthlyRevenue || 1)) * 100));


        // Overall Weighted
        const overallScore = Math.round(
            (liquidityScore * 0.40) +
            (profitabilityScore * 0.30) +
            (operationalScore * 0.15) +
            (taxRiskScore * 0.15)
        );

        const insights: string[] = [];
        if (runway < 2) insights.push('⚠️ Alerta de Caixa: Você tem menos de 2 meses de sobrevivência.');
        if (netMargin < 0.10) insights.push('⚠️ Margem Baixa: Sua lucratividade está abaixo de 10%.');
        if (overallScore > 80) insights.push('🎉 Parabéns! Finanças saudáveis.');
        if (cashAvailable === 50000 && monthlyRevenue === 30000) insights.push('ℹ️ Estes são dados de exemplo. Atualize nas Configurações.');

        return {
            overallScore,
            components: {
                liquidity: Math.round(liquidityScore),
                profitability: Math.round(profitabilityScore),
                operational: Math.round(operationalScore),
                taxRisk: Math.round(taxRiskScore),
            },
            insights
        };
    }

    async getForecast(companyId: string, days: number): Promise<any> {
        // Mock forecast
        return {
            days,
            projection: Array.from({ length: days }, (_, i) => ({
                day: i + 1,
                balance: 50000 + (Math.random() * 5000 - 2000) * i
            }))
        };
    }
}
