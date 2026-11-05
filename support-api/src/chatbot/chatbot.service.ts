import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  respondToMessage(message: string) {
    // Lógica de eco simple para empezar
    const response = `He recibido tu mensaje: "${message}". Próximamente te responderé con más inteligencia.`;
    return { reply: response };
  }
}
