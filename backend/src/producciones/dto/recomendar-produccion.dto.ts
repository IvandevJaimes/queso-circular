import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class RecomendarProduccionDto {
  @IsNumber()
  @IsPositive()
  litrosLeche: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contexto?: string[];
}
