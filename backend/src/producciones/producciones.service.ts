import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Injectable, Optional } from '@nestjs/common';
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

const VERCEL_TMP_DB = '/tmp/queso-producciones.json';

@Injectable()
export class ProduccionesService {
  private memoryStore: Produccion[] = [];

  constructor(
    @Optional()
    @InjectRepository(Produccion)
    private readonly produccionesRepository: Repository<Produccion> | null,
    private readonly iaService: IaService,
  ) {}

  private leerTmp(): Produccion[] {
    try {
      if (existsSync(VERCEL_TMP_DB)) {
        const parsed = JSON.parse(
          readFileSync(VERCEL_TMP_DB, 'utf8'),
        ) as Produccion[];
        if (Array.isArray(parsed)) {
          this.memoryStore = parsed;
          return parsed;
        }
      }
    } catch {
      // Usar copia en memoria si /tmp no está disponible
    }
    return this.memoryStore;
  }

  private guardarTmp(items: Produccion[]): void {
    this.memoryStore = items;
    try {
      writeFileSync(VERCEL_TMP_DB, JSON.stringify(items), 'utf8');
    } catch {
      // Ignorar si /tmp falla; se conserva en memoria
    }
  }

  async crear(datos: CrearProduccionDto) {
    const queso = datos.litrosLeche * 0.12;
    const suero = datos.litrosLeche * 0.88;
    const fecha = new Date().toISOString();

    if (!this.produccionesRepository) {
      const actuales = this.leerTmp();
      const nextId =
        actuales.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const nueva: Produccion = {
        id: nextId,
        litrosLeche: datos.litrosLeche,
        quesoEstimado: queso,
        sueroEstimado: suero,
        fecha,
      };
      this.guardarTmp([nueva, ...actuales]);
      return nueva;
    }

    const produccion = this.produccionesRepository.create({
      litrosLeche: datos.litrosLeche,
      quesoEstimado: queso,
      sueroEstimado: suero,
      fecha,
    });

    return this.produccionesRepository.save(produccion);
  }

  async obtenerTodas() {
    if (!this.produccionesRepository) {
      return this.leerTmp();
    }
    return this.produccionesRepository.find({
      order: { id: 'DESC' },
    });
  }

  async obtenerUna(id: number) {
    if (!this.produccionesRepository) {
      return this.leerTmp().find((item) => item.id === id) ?? null;
    }
    return this.produccionesRepository.findOneBy({ id });
  }

  async eliminar(id: number) {
    if (!this.produccionesRepository) {
      const actuales = this.leerTmp();
      const filtradas = actuales.filter((item) => item.id !== id);
      const affected = actuales.length - filtradas.length;
      if (affected > 0) {
        this.guardarTmp(filtradas);
      }
      return { affected };
    }
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
