import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produccion } from './produccion.entity';
import { CrearProduccionDto } from './dto/crear-produccion.dto';

@Injectable()
export class ProduccionesService {
  constructor(
    @InjectRepository(Produccion)
    private produccionesRepository: Repository<Produccion>,
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
}
