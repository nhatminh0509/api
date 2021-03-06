import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './core/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || 3000)
}
bootstrap();
