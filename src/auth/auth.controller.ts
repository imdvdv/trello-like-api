import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiResponse({ 
        status: 201, 
        description: 'Пользователь успешно зарегистрирован',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Ошибка валидации' })
    @ApiResponse({ status: 409, description: 'Пользователь с таким email уже существует' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiResponse({ 
        status: 200, 
        description: 'Успешная авторизация',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Выход из системы' })
    @ApiResponse({ 
        status: 200, 
        description: 'Выход выполнен успешно',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Выход выполнен успешно' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Необходима авторизация' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    async logout() {
        return await this.authService.logout();
    }
}
