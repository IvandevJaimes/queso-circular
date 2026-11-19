import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduccionesModule } from './producciones/producciones.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:
        process.env.SQLITE_PATH ||
        (process.env.VERCEL ? '/tmp/queso.db' : 'queso.db'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProduccionesModule,
  ],
})
export class AppModule {}
