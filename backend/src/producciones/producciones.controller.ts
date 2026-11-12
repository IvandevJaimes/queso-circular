import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';

import { ProduccionesService } from './producciones.service';
import { CrearProduccionDto } from './dto/crear-produccion.dto';

@Controller('producciones')
export class ProduccionesController {
  constructor(private produccionesService: ProduccionesService) {}

  @Post()
  crear(@Body() datos: CrearProduccionDto) {
    return this.produccionesService.crear(datos);
  }

  @Get()
  obtenerTodas() {
    return this.produccionesService.obtenerTodas();
  }

  @Get(':id')
  async obtenerUna(@Param('id', ParseIntPipe) id: number) {
    const produccion = await this.produccionesService.obtenerUna(id);

    if (!produccion) {
      throw new NotFoundException('Producción no encontrada');
    }

    return produccion;
  }

  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    const resultado = await this.produccionesService.eliminar(id);

    if (resultado.affected === 0) {
      throw new NotFoundException('Producción no encontrada');
    }

    return { mensaje: 'Producción eliminada correctamente' };
  }
}
