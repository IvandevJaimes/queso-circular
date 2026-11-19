import type { IncomingMessage, ServerResponse } from 'node:http';
import nestHandler from '../backend/dist/serverless.js';

type HandlerFn = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void> | void;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const fn =
    typeof nestHandler === 'function'
      ? nestHandler
      : (nestHandler as unknown as { default: HandlerFn }).default;
  return fn(req, res);
}
