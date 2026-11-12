import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduccionesModule } from './producciones/producciones.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'queso.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProduccionesModule,
  ],
})
export class AppModule {}
