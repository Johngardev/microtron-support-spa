import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './schemas/message.schemas';

@Controller('incidents/:id/messages')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getMessages(@Param('id') incidentId: string): Promise<Message[]> {
    return this.chatService.getHistory(incidentId);
  }
}
