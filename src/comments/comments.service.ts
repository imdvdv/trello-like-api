import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly cardsService: CardsService
  ) {}

  async create(
    cardId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {

    await this.cardsService.findById(cardId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      card_id: cardId,
      user_id: userId,
    });
    return await this.commentRepository.save(comment);
  }

  async findByCardId(cardId: number): Promise<Comment[]> {
    await this.cardsService.findById(cardId);
    return await this.commentRepository.find({
      where: { card_id: cardId },
      order: { created_at: 'ASC' },
    });
  }

  async findById(commentId: number, cardId?: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({where: { id: commentId }});

    if (!comment) {
      throw new NotFoundException(`Комментарий ID ${commentId} не найден`);
    }
  
    if (cardId !== undefined && comment.card_id !== cardId) {
      throw new NotFoundException(`Комментарий ID ${commentId} не найден в карточке ID ${cardId}`);
    }

    return comment;
  }

  async update(commentId: number, updateCommentDto: UpdateCommentDto, cardId?: number): Promise<Comment> {
    const comment = await this.findById(commentId, cardId);
    Object.assign(comment, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async remove(commentId: number, cardId?: number): Promise<void> {
    const comment = await this.findById(commentId, cardId);
    await this.commentRepository.remove(comment);
  }
}
