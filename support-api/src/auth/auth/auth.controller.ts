/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Post, HttpCode, HttpStatus, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserRole } from '../../users/schemas/user.schema';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    return this.authService.login(user);
  }

   @Post('register')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Registrar usuario' })
   @ApiResponse({ status: 200, description: 'Usuario registrado exitosamente' })
   @ApiResponse({ status: 409, description: 'Correo electrónico ya en uso' })
   async register(@Body() registerDto: RegisterDto) {
     return this.authService.register(registerDto);
   }

  @Post('register-admin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar nuevo administrador (solo para administradores)' })
  @ApiResponse({ status: 201, description: 'Administrador registrado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  async registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.register({
      ...registerDto,
      role: UserRole.ADMIN,
    });
  }
   
}