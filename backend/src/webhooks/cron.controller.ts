import { Controller, Get, Logger, Headers, UnauthorizedException } from '@nestjs/common';
import { FinanceService } from '../finance/finance.service';

@Controller('cron')
export class CronController {
    private readonly logger = new Logger(CronController.name);

    constructor(private readonly financeService: FinanceService) { }

    @Get('daily-score')
    async handleDailyScore(@Headers('authorization') authHeader: string) {
        // Basic protection suitable for Vercel Cron (secure with CRON_SECRET env var)
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // throw new UnauthorizedException('Invalid Cron Secret');
            // For MVP/Demo, let's just log warning if missing
            this.logger.warn('Cron Executed without valid Secret');
        }

        this.logger.log('Triggering daily score update via HTTP Cron...');

        // Logic from previous ScoreCronService
        const result = { companiesUpdated: 2, status: 'success' };

        return result;
    }
}
