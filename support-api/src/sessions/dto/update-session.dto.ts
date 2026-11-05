import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  admin?: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  scheduledDate?: Date;

  @IsOptional()
  @IsEnum(['Abierto', 'Cerrado'])
  status?: 'Abierto' | 'Cerrado';
}
