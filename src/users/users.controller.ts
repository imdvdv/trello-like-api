import { Controller, Get, UseGuards, Param, ParseIntPipe, Patch, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { Owner } from '../decorators/owner.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список пользователей успешно получен',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь успешно получен',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findOne(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.findById(userId);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Owner({ paramName: 'userId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Пользователь успешно обновлен',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 409, description: 'Пользователь с таким email уже существует' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @Owner({ paramName: 'userId' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 204, 
    description: 'Пользователь успешно удален'
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async remove(@Param('userId', ParseIntPipe) userId: number) {
    await this.usersService.remove(userId);
  }
}
