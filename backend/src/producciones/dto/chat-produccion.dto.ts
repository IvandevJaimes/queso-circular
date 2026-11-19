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
  @IsOptional()
  @IsNumber()
  @IsPositive()
  litrosLeche?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  litrosAnteriores?: number;

  @IsOptional()
  @IsIn(['inicial', 'cambio_litros', 'pregunta'])
  tipoInteraccion?: 'inicial' | 'cambio_litros' | 'pregunta';

  @IsOptional()
  @IsString()
  @MaxLength(60)
  alternativaObjetivo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  preguntaUsuario?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistorialMensajeDto)
  historial?: HistorialMensajeDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recetasPrevias?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alternativasPrevias?: string[];
}
