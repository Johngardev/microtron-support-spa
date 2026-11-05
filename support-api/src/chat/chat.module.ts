import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Necesario para la conexión a MongoDB
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './schemas/message.schemas';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), // Registramos el esquema
  ],
  providers: [ChatGateway, ChatService], // Agregamos el ChatService
  exports: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
