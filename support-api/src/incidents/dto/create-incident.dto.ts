/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsEmail,
} from 'class-validator';
import { IncidentPriority } from '../schemas/incident.schema';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IncidentPriority)
  @IsNotEmpty()
  priority: string;

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  notificationEmails?: string[];

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
