import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type IncidentDocument = Incident & Document;

export enum IncidentPriority {
  HIGH = 'Alta',
  MEDIUM = 'Media',
  LOW = 'Baja',
}

export enum IncidentStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Proceso',
  RESOLVED = 'Resuelto',
  CLOSED = 'Cerrado',
}

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({
    type: String,
    enum: IncidentStatus,
    default: IncidentStatus.OPEN,
  })
  status: IncidentStatus;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: IncidentPriority,
    required: true,
  })
  priority: IncidentPriority;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo?: Types.ObjectId | User;

  @Prop([String])
  notificationEmails?: string[];

  @Prop([String])
  attachments?: string[]; // Aquí guardaremos las URLs de los archivos subidos

  @Prop()
  phoneNumber?: string;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);

// Al final del archivo, después de la definición del esquema
IncidentSchema.index({ createdAt: -1 }); // Índice descendente
