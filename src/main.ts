import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'module-alias/register';
import 'reflect-metadata';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Habilita a transformação de tipos
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de AITs')
    .setDescription(
      'Documentação da API para gerenciamento de Autos de Infração de Trânsito',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
