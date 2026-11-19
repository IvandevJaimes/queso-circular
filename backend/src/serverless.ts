import 'reflect-metadata';
import type { IncomingMessage, ServerResponse } from 'node:http';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { crearAppNest } from './app.factory';

const server = express();
let readyPromise: Promise<void> | null = null;

function ensureServerReady(): Promise<void> {
  if (!readyPromise) {
    readyPromise = (async () => {
      const app = await crearAppNest(new ExpressAdapter(server));
      await app.init();
    })();
  }
  return readyPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  await ensureServerReady();
  server(req, res);
}
