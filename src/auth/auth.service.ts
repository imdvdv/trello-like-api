import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    return {
      access_token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);
    const errorMessage = 'Неверный email или пароль';

    if (!user) {
      throw new UnauthorizedException(errorMessage);
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException(errorMessage);
    }

    return {
      access_token: this.generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async logout(): Promise<{ message: string }> {
    return { message: 'Выход выполнен успешно' };
  }

  private generateToken(user: User): string {
    if (user.id == null || !user.email || user.email.trim() === '') {
      throw new UnauthorizedException('Необходимые payload данные не найдены в БД');
    }
    const payload: JwtPayload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}