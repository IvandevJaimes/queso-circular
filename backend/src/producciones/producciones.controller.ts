import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { ChatProduccionDto } from './dto/chat-produccion.dto';
import { CrearProduccionDto } from './dto/crear-produccion.dto';
import { RecomendarProduccionDto } from './dto/recomendar-produccion.dto';
import { ProduccionesService } from './producciones.service';

@Controller('producciones')
export class ProduccionesController {
  constructor(private produccionesService: ProduccionesService) {}

  @Post()
  crear(@Body() datos: CrearProduccionDto) {
    return this.produccionesService.crear(datos);
  }

  @Post('recomendar')
  recomendar(@Body() dto: RecomendarProduccionDto) {
    return this.produccionesService.generarRecomendacionIA(dto);
  }

  @Post('chat')
  chat(@Body() dto: ChatProduccionDto) {
    return this.produccionesService.responderChatIA(dto);
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
