import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestApplicationOptions } from '@nestjs/common';
import type { AbstractHttpAdapter } from '@nestjs/core';
import { AppModule } from './app.module';

export async function cargarVariablesEntorno(): Promise<void> {
  if (process.env.VERCEL) return;

  try {
    const envPath =
      typeof __dirname !== 'undefined'
        ? resolve(__dirname, '../.env')
        : resolve(process.cwd(), '.env');

    if (!existsSync(envPath) && !existsSync(resolve(process.cwd(), '.env'))) {
      return;
    }

    const dotenvModule = await import('dotenv');
    const configFn =
      dotenvModule.config ??
      (dotenvModule as unknown as { default?: { config?: typeof dotenvModule.config } })
        .default?.config;
    if (typeof configFn === 'function') {
      if (existsSync(envPath)) {
        configFn({ path: envPath });
      }
      configFn();
    }
  } catch {
    // Si dotenv no está instalado en producción serverless, usar process.env directo
  }
}

export async function crearAppNest(
  adapter?: AbstractHttpAdapter,
  options?: NestApplicationOptions,
): Promise<INestApplication> {
  await cargarVariablesEntorno();

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
