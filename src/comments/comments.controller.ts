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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OwnerGuard } from '../guards/owner.guard';
import { Owner } from '../decorators/owner.decorator'
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { Comment } from './comment.entity';

@ApiTags('Комментарии')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('cards/:cardId/comments')
  @ApiOperation({ summary: 'Создание комментария к карточке' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 201, 
    description: 'Комментарий успешно создан',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async create(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return await this.commentsService.create(cardId, user.id, createCommentDto);
  }

  @Get('cards/:cardId/comments')
  @ApiOperation({ summary: 'Получение всех комментариев карточки' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Список комментариев успешно получен',
    type: [Comment],
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Карточка не найдена' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findAll(
    @Param('cardId', ParseIntPipe) cardId: number,
  ) {
    return await this.commentsService.findByCardId(cardId);
  }

  @Get('cards/:cardId/comments/:commentId')
  @ApiOperation({ summary: 'Получение комментария по ID' })
  @ApiParam({ name: 'commentId', description: 'ID комментария' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Комментарий успешно получен',
    type: Comment,
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async findOne(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentsService.findById(commentId, cardId);
  }

  @Patch('cards/:cardId/comments/:commentId')
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'commentId', entityName: 'Комментарий' })
  @ApiOperation({ summary: 'Обновление комментария' })
  @ApiParam({ name: 'commentId', description: 'ID комментария' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Комментарий успешно обновлен',
    type: Comment,
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async update(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(commentId, updateCommentDto, cardId);
  }

  @Delete('cards/:cardId/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnerGuard)
  @Owner({ paramName: 'commentId', entityName: 'Комментарий' })
  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiParam({ name: 'commentId', description: 'ID комментария' })
  @ApiParam({ name: 'cardId', description: 'ID карточки' })
  @ApiResponse({ 
    status: 204, 
    description: 'Комментарий успешно удален'
  })
  @ApiResponse({ status: 401, description: 'Необходима авторизация' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Комментарий не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async remove(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    await this.commentsService.remove(commentId, cardId);
  }
}
