import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class HistorialMensajeDto {
  @IsIn(['user', 'assistant'])
  role: 'user' | 'assistant';

  @IsString()
  @MaxLength(600)
  texto: string;
}

export class ChatProduccionDto {
  @IsNumber()
  @IsPositive()
  litrosLeche: number;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  preguntaUsuario?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistorialMensajeDto)
  historial?: HistorialMensajeDto[];
}
