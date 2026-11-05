import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Session extends Document {
  @Prop({ required: true })
  declare id: string;

  @Prop({ required: true })
  manufacturerKey: string;

  @Prop({ required: true })
  manufacturerName: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  admin: string;

  @Prop({ type: [String], default: [] })
  emails: string[];

  @Prop({ required: true })
  requestDate: Date;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ required: true, enum: ['Abierto', 'Cerrado'], default: 'Abierto' })
  status: 'Abierto' | 'Cerrado';

  @Prop()
  calendlyEventUri?: string;

  @Prop()
  calendlyInviteeUri?: string;

  @Prop({ default: null })
  createdAt?: Date;

  @Prop({ default: null })
  updatedAt?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
