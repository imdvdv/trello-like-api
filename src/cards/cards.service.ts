import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ColumnsService } from '../columns/columns.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly columnsService: ColumnsService,
  ) {}

  async create(columnId: number, userId: number, createCardDto: CreateCardDto): Promise<Card> {
    await this.columnsService.findById(columnId);

    const card = this.cardRepository.create({
      ...createCardDto,
      column_id: columnId,
      user_id: userId,
      position: createCardDto.position ?? 0,
    });

    return await this.cardRepository.save(card);
  }

  async findAllByColumnId(columnId: number): Promise<Card[]> {
    await this.columnsService.findById(columnId);

    return await this.cardRepository.find({
      where: { column_id: columnId },
      order: { position: 'ASC', created_at: 'ASC' },
    });
  }

  async findById(cardId: number, columnId?: number): Promise<Card> {
    const card = await this.cardRepository.findOne({where: { id: cardId }});

    if (!card) {
      throw new NotFoundException(`Карточка ID ${cardId} не найдена`);
    }

    if (columnId !== undefined && card.column_id !== columnId) {
      throw new NotFoundException(`Карточка ID ${cardId} не найдена в колонке ID ${columnId}`);
    }

    return card;
    }


  async update(cardId: number, updateCardDto: UpdateCardDto, columnId?: number): Promise<Card> {
    const card = await this.findById(cardId, columnId);
    Object.assign(card, updateCardDto);
    return await this.cardRepository.save(card);
  }

  async remove(cardId: number, columnId?: number): Promise<void> {
    const card = await this.findById(cardId, columnId);
    await this.cardRepository.remove(card);
  }
}
