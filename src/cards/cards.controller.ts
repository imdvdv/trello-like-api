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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { Owner } from '../decorators/owner.decorator'
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { Card } from './card.entity';

@ApiTags('Карточки')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('columns/:columnId/cards')
  @ApiOperation({ summary: 'Создание новой карточки в колонке' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiResponse({ 
    status: 201, 
    description: 'Карточка успешно создана',
    type: Card,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async create(
    @Param('columnId', ParseIntPipe) columnId: number,
    @GetUser() user: User,
    @Body() createCardDto: CreateCardDto,
  ) {
    return await this.cardsService.create(columnId, user.id, createCardDto);
  }

  @Get('columns/:columnId/cards')
  @ApiOperation({ summary: 'Получение всех карточек колонки' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список карточек успешно получен',
    type: [Card],
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Колонка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll(
    @Param('columnId', ParseIntPipe) columnId: number,
  ) {
    return await this.cardsService.findAllByColumnId(columnId);
  }

  @Get('columns/:columnId/cards/:cardId')
  @ApiOperation({ summary: 'Получение карточки по ID' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Карточка успешно получена',
    type: Card,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findOne(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return await this.cardsService.findById(cardId, columnId);
  }

  @Patch('columns/:columnId/cards/:cardId')
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'cardId', entityName: 'Карточка' })
  @ApiOperation({ summary: 'Обновление карточки' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Карточка успешно обновлена',
    type: Card,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async update(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return await this.cardsService.update(cardId, updateCardDto, columnId);
  }

  @Delete('columns/:columnId/cards/:cardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'cardId', entityName: 'Карточка' })
  @ApiOperation({ summary: 'Удаление карточки' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiParam({ name: 'columnId', description: 'ID колонки' })
  @ApiResponse({ 
    status: 204, 
    description: 'Карточка успешно удалена'
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async remove(
    @Param('columnId', ParseIntPipe) columnId: number,
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    await this.cardsService.remove(cardId, columnId);
  }
}
