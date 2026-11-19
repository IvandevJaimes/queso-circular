import { Injectable } from '@nestjs/common';
import { ChatProduccionDto } from './dto/chat-produccion.dto';
import { RecomendarProduccionDto } from './dto/recomendar-produccion.dto';
import {
  type AlternativaId,
  type ChatIAResponse,
  type RecomendacionIAResponse,
  generarRecomendacionEngine,
  responderChatEngine,
} from './ia.engine.js';

export type { AlternativaId, ChatIAResponse, RecomendacionIAResponse };

@Injectable()
export class IaService {
  async generarRecomendacion(
    dto: RecomendarProduccionDto,
  ): Promise<RecomendacionIAResponse> {
    return generarRecomendacionEngine(dto);
  }

  async responderChat(dto: ChatProduccionDto): Promise<ChatIAResponse> {
    return responderChatEngine(dto);
  }
}
