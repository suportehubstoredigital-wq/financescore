import { Controller, Post, Body, Logger, Headers, BadRequestException } from '@nestjs/common';

@Controller('webhooks/stripe')
export class StripeController {
    private readonly logger = new Logger(StripeController.name);

    // In production, verify Stripe Signature header!
    @Post()
    async handleWebhook(@Body() event: any, @Headers('stripe-signature') signature: string) {
        if (!event.type) {
            throw new BadRequestException('Invalid event');
        }

        this.logger.log(`Received Stripe Webhook: ${event.type}`);

        switch (event.type) {
            case 'invoice.paid':
                await this.handleInvoicePaid(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await this.handleSubscriptionDeleted(event.data.object);
                break;
            default:
                this.logger.debug(`Unhandled event type: ${event.type}`);
        }

        return { received: true };
    }

    private async handleInvoicePaid(invoice: any) {
        this.logger.log(`💰 Payment succeeded for Subscription ${invoice.subscription}`);
        // TODO: Update Prisma Subscription status to 'ACTIVE'
        // await this.prisma.subscription.update(...)
    }

    private async handleSubscriptionDeleted(subscription: any) {
        this.logger.warn(`❌ Subscription canceled: ${subscription.id}`);
        // TODO: Update Prisma Subscription status to 'CANCELED'
        // await this.prisma.subscription.update(...)
    }
}
