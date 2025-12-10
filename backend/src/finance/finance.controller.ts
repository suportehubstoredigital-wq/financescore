import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) { }

    @Get('score')
    async getScore(@Query('companyId') companyId: string) {
        // In real app, companyId comes from @Request().user.companyId
        return this.financeService.calculateScore(companyId || 'mock-id');
    }

    @Get('forecast')
    async getForecast(@Query('companyId') companyId: string, @Query('days') days: number) {
        return this.financeService.getForecast(companyId || 'mock-id', Number(days) || 7);
    }

    @Get('can-spend-today')
    async getCanSpend(@Query('companyId') companyId: string) {
        return {
            safeToSpend: 15400.00,
            currency: 'BRL',
            message: 'Você pode gastar até R$ 15.400 sem comprometer o caixa de 30 dias.'
        };
    }
}
