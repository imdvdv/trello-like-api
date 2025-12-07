import { Entity, Column as ColumnDecorator, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('columns')
export class Column {
  @ApiProperty({ description: 'ID колонки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Название колонки' })
  @ColumnDecorator()
  title: string;

  @ApiProperty({ description: 'Позиция колонки для сортировки', default: 0 })
  @ColumnDecorator({ default: 0 })
  position: number;

  @ApiProperty({ description: 'ID пользователя (автора)' })
  @Index()
  @ColumnDecorator()
  user_id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.columns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Card, (card) => card.column)
  cards: Card[];
}


