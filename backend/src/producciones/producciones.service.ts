import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatProduccionDto } from './dto/chat-produccion.dto';
import { CrearProduccionDto } from './dto/crear-produccion.dto';
import { RecomendarProduccionDto } from './dto/recomendar-produccion.dto';
import {
  ChatIAResponse,
  IaService,
  RecomendacionIAResponse,
} from './ia.service';
import { Produccion } from './produccion.entity';

@Injectable()
export class ProduccionesService {
  constructor(
    @InjectRepository(Produccion)
    private produccionesRepository: Repository<Produccion>,
    private readonly iaService: IaService,
  ) {}

  async crear(datos: CrearProduccionDto) {
    const queso = datos.litrosLeche * 0.12;
    const suero = datos.litrosLeche * 0.88;

    const produccion = this.produccionesRepository.create({
      litrosLeche: datos.litrosLeche,
      quesoEstimado: queso,
      sueroEstimado: suero,
      fecha: new Date().toISOString(),
    });

    return this.produccionesRepository.save(produccion);
  }

  async obtenerTodas() {
    return this.produccionesRepository.find({
      order: { id: 'DESC' },
    });
  }

  async obtenerUna(id: number) {
    return this.produccionesRepository.findOneBy({ id });
  }

  async eliminar(id: number) {
    return this.produccionesRepository.delete(id);
  }

  async generarRecomendacionIA(
    dto: RecomendarProduccionDto,
  ): Promise<RecomendacionIAResponse> {
    return this.iaService.generarRecomendacion(dto);
  }

  async responderChatIA(dto: ChatProduccionDto): Promise<ChatIAResponse> {
    return this.iaService.responderChat(dto);
  }
}
