/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { UserRole } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UsersService,
  ) {}

  getToken(): string {
    return this.jwtService.sign({});
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userObject = user.toObject ? user.toObject() : user;
      const { password, ...result } = userObject;
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    const newUser = await this.userService.create({
      ...registerDto,
      isActive: true,
      role: registerDto.role || UserRole.USER,
    });

    const { password, ...result } = newUser.toObject
      ? newUser.toObject()
      : newUser;

    // Return the same structure as login
    return {
      access_token: this.jwtService.sign({
        email: result.email,
        sub: result._id,
        role: result.role,
      }),
      user: {
        _id: result._id,
        email: result.email,
        name: result.name,
        role: result.role,
        isActive: result.isActive,
      },
    };
  }

  async login(user: any) {
    const userObject = user.toObject ? user.toObject() : user;

    const payload = {
      email: userObject.email,
      sub: userObject._id || userObject.id,
      role: userObject.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userObject._id || userObject.id,
        email: userObject.email,
        name: userObject.name,
        role: userObject.role,
      },
    };
  }
}
