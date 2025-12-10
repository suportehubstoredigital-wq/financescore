import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { ScoreCronService } from './score-cron.service';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, ScoreCronService]
})
export class FinanceModule { }
