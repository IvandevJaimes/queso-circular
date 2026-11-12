import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('producciones')
export class Produccion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  litrosLeche: number;

  @Column('float')
  quesoEstimado: number;

  @Column('float')
  sueroEstimado: number;

  @Column()
  fecha: string;
}
