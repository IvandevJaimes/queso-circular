import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduccionesModule } from './producciones/producciones.module';

const isVercel = Boolean(process.env.VERCEL);

@Module({
  imports: [
    ...(isVercel
      ? []
      : [
          TypeOrmModule.forRoot({
            type: 'sqlite',
            database: process.env.SQLITE_PATH || 'queso.db',
            autoLoadEntities: true,
            synchronize: true,
          }),
        ]),
    ProduccionesModule,
  ],
})
export class AppModule {}
