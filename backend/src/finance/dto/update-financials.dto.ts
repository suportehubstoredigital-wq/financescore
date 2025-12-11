import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateFinancialsDto {
    @IsNumber()
    @Min(0)
    cashBalance: number;

    @IsNumber()
    @Min(0)
    monthlyRevenue: number;

    @IsNumber()
    @Min(0)
    monthlyExpenses: number;

    @IsNumber()
    @Min(0)
    totalTaxLiability: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    overdueDebts?: number;
}
