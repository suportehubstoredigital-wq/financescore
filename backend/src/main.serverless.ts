import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function (req: any, res: any) {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // Important for Vercel routing

    await app.init();

    const instance = app.getHttpAdapter().getInstance();
    return instance(req, res);
}
