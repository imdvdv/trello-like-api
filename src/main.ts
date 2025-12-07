import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort = configService.get<number>('APP_PORT', 3000);
  const appVersion = configService.get<string>('APP_VERSION', 'v1');
  app.setGlobalPrefix(`api/${appVersion}`);

  ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Trello-like API')
    .setDescription('RESTful API аналог Trello')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(appPort);
  console.log(`Приложение запущено на порту ${appPort}`);
  console.log(`Swagger документация доступна на http://localhost:${appPort}/api/docs`);
}
bootstrap();
