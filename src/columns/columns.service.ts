import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Column } from './column.entity';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, createColumnDto: CreateColumnDto): Promise<Column> {
    await this.usersService.findById(userId);
    const column = this.columnRepository.create({
      ...createColumnDto,
      user_id: userId,
      position: createColumnDto.position ?? 0,
    });

    return await this.columnRepository.save(column);
  }

  async findById(columnId: number, userId?: number): Promise<Column> {
    const column = await this.columnRepository.findOne({ where: { id: columnId } });
    
    if (!column) {
      throw new NotFoundException(`Колонка ID ${columnId} не найдена`);
    }

    if (userId !== undefined && column.user_id !== userId) {
      throw new NotFoundException(`Колонка ID ${columnId} не найдена у пользователя ID ${userId}`);
    }

    return column;
  }

  async findByUserId(userId: number): Promise<Column[]> {
    await this.usersService.findById(userId);
    return await this.columnRepository.find({
      where: { user_id: userId },
      order: { position: 'ASC', created_at: 'ASC' },
    });
  }

  async update(columnId: number, updateColumnDto: UpdateColumnDto, userId?: number): Promise<Column> {
    const column = await this.findById(columnId, userId);
    Object.assign(column, updateColumnDto);
    return await this.columnRepository.save(column);
  }

  async remove(columnId: number, userId?: number): Promise<void> {
    const column = await this.findById(columnId, userId);
    await this.columnRepository.remove(column);
  }
}

