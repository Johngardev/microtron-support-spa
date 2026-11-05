import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotMessageDto } from './dto/chatbot-message.dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Public()
  @Post('message')
  handleMessage(
    @Body(new ValidationPipe()) chatbotMessageDto: ChatbotMessageDto,
  ) {
    return this.chatbotService.respondToMessage(chatbotMessageDto.message);
  }
}
