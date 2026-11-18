import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IaService } from './ia.service';
import { Produccion } from './produccion.entity';
import { ProduccionesController } from './producciones.controller';
import { ProduccionesService } from './producciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produccion])],
  controllers: [ProduccionesController],
  providers: [ProduccionesService, IaService],
})
export class ProduccionesModule {}
