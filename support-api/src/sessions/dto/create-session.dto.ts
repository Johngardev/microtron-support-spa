import { IsString, IsEmail, IsDate, IsOptional, IsArray, ArrayMinSize, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsString()
  manufacturerKey: string;

  @IsString()
  manufacturerName: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  admin: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un email' })
  @IsEmail({}, { each: true, message: 'Cada email debe ser válido' })
  emails: string[];

  @Type(() => Date)
  @IsDate({ message: 'requestDate debe ser una fecha válida' })
  requestDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'scheduledDate debe ser una fecha válida' })
  scheduledDate: Date;

  @IsOptional()
  @IsString()
  calendlyEventUri?: string;
}
