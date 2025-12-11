import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanceModule } from './finance/finance.module';
import { QueuesModule } from './queues/queues.module';
import { StripeController } from './webhooks/stripe/stripe.controller';
import { CronController } from './webhooks/cron.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    FinanceModule,
    QueuesModule,
    PrismaModule
  ],
  controllers: [AppController, StripeController, CronController],
  providers: [AppService],
})
export class AppModule { }
