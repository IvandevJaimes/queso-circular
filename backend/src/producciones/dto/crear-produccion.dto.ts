import { IsNumber, IsPositive } from 'class-validator';

export class CrearProduccionDto {
  @IsNumber()
  @IsPositive()
  litrosLeche: number;
}