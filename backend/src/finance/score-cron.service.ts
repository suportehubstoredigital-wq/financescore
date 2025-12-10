import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FinanceService } from '../finance/finance.service';

@Injectable()
export class ScoreCronService {
    private readonly logger = new Logger(ScoreCronService.name);

    constructor(private readonly financeService: FinanceService) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleDailyScoreUpdate() {
        this.logger.log('Running daily score update for all active companies...');

        // Mock iteration over companies
        // In real app: const companies = await prisma.company.findMany();
        const companies = [{ id: 'mock-id-1' }, { id: 'mock-id-2' }];

        for (const company of companies) {
            this.logger.debug(`Updating score for company ${company.id}`);
            // await this.financeService.calculateScore(company.id);
            // await this.prisma.scoreMetric.create(...)
        }

        this.logger.log('Daily score update completed.');
    }

    @Cron('0 0 * * 0') // Every Sunday
    async handleWeeklyCleanup() {
        this.logger.log('Performing weekly data cleanup...');
        // Clean old logs/temp files
    }
}
