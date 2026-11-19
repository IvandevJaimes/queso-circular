import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

try {
  if (typeof __dirname !== 'undefined') {
    loadEnv({ path: resolve(__dirname, '../.env') });
  }
  loadEnv();
} catch {
  // En entornos serverless las variables se leen directamente desde process.env
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Queso Circular IA API funcionando en el puerto ${port}`);
}

void bootstrap();
