import { crearAppNest } from './app.factory';

async function bootstrap() {
  const app = await crearAppNest();
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`Queso Circular IA API funcionando en el puerto ${port}`);
}

void bootstrap();
