import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestApplicationOptions } from '@nestjs/common';
import type { AbstractHttpAdapter } from '@nestjs/core';
import { AppModule } from './app.module';

export function cargarVariablesEntorno(): void {
  try {
    if (typeof __dirname !== 'undefined') {
      loadEnv({ path: resolve(__dirname, '../.env') });
    }
    loadEnv();
  } catch {
    // En entornos serverless las variables se leen directamente desde process.env
  }
}

export async function crearAppNest(
  adapter?: AbstractHttpAdapter,
  options?: NestApplicationOptions,
): Promise<INestApplication> {
  cargarVariablesEntorno();

  const app = adapter
    ? await NestFactory.create(AppModule, adapter, options)
    : await NestFactory.create(AppModule, options);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  return app;
}
