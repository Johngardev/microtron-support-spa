import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ required: true, index: true }) // Indexamos por ID del incidente para búsquedas rápidas
  incidentId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  sender: string; // Nombre de la persona que envía

  @Prop({ required: true, enum: ['Admin', 'User'] })
  senderType: 'Admin' | 'User';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
