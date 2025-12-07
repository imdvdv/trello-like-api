import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiParam 
} from '@nestjs/swagger';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { Owner } from '../decorators/owner.decorator'
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { Column } from './column.entity';


@ApiTags('Колонки')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post('users/:userId/columns')
  @UseGuards(OwnerGuard)
  @Owner({paramName: 'userId'})
  @ApiOperation({ summary: 'Создание новой колонки для пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 201, 
    description: 'Колонка успешно создана',
    type: Column,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async create(
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: User,
    @Body() createColumnDto: CreateColumnDto,
  ) {
    return await this.columnsService.create(user.id, createColumnDto);
  }

  @Get('users/:userId/columns')
  @ApiOperation({ summary: 'Получение всех колонок пользователя' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список колонок успешно получен',
    type: [Column],
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.columnsService.findByUserId(userId);
  }

  @Get('users/:userId/columns/:columnId')
  @ApiOperation({ summary: 'Получение колонки по ID' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Колонка успешно получена',
    type: Column,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    return await this.columnsService.findById(columnId, userId);
  }

  @Patch('users/:userId/columns/:columnId')
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'columnId', entityName: 'Колонка' })
  @ApiOperation({ summary: 'Обновление колонки' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 200, 
    description: 'Колонка успешно обновлена',
    type: Column,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async update(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return await this.columnsService.update(columnId, updateColumnDto, userId);
  }

  @Delete('users/:userId/columns/:columnId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'columnId', entityName: 'Колонка' })
  @ApiOperation({ summary: 'Удаление колонки' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiParam({ name: 'userId', description: 'ID пользователя' })
  @ApiResponse({ 
    status: 204, 
    description: 'Колонка успешно удалена'
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    await this.columnsService.remove(columnId, userId);
  }
}
