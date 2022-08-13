import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule }                    from './app.module';
import { ValidationPipe }                 from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

( async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
    }));

    app.useLogger([ 'log', 'warn', 'error', 'verbose', 'debug' ]);

    const swaggerConf = new DocumentBuilder()
        .setTitle('Udemy example')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('user')
        .addTag('report')
        .build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, swaggerConf));

    await app.listen(3000);
} )();
