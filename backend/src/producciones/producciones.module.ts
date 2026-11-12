import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Produccion } from './produccion.entity';
import { ProduccionesController } from './producciones.controller';
import { ProduccionesService } from './producciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produccion])],
  controllers: [ProduccionesController],
  providers: [ProduccionesService],
})
export class ProduccionesModule {}
