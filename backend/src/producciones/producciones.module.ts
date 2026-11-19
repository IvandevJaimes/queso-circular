import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IaService } from './ia.service';
import { Produccion } from './produccion.entity';
import { ProduccionesController } from './producciones.controller';
import { ProduccionesService } from './producciones.service';

const isVercel = Boolean(process.env.VERCEL);

@Module({
  imports: isVercel ? [] : [TypeOrmModule.forFeature([Produccion])],
  controllers: [ProduccionesController],
  providers: [ProduccionesService, IaService],
})
export class ProduccionesModule {}
