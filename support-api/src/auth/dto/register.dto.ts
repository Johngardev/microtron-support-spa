/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "../../users/schemas/user.schema";

export class RegisterDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Nombre Apellido' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'contraseñaSegura123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: 'user', 
    enum: Object.values(UserRole),
    default: 'user'
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be user or admin' })
  role?: UserRole;
}