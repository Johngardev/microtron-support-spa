/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schemas';

// Definición de la estructura de datos para guardar
interface CreateMessageDto {
  incidentId: string;
  text: string;
  sender: string;
  senderType: 'Admin' | 'User';
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  /**
   * Guarda un nuevo mensaje en la BD
   */
  async createMessage(data: CreateMessageDto): Promise<Message> {
    const createdMessage = new this.messageModel(data);
    return createdMessage.save();
  }

  /**
   * Obtiene el historial de mensajes para un incidente específico
   */
  async getHistory(incidentId: string): Promise<Message[]> {
    return this.messageModel.find({ incidentId }).exec();
  }
}
