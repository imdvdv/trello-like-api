import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Column as ColumnEntity } from '../columns/column.entity';
import { User } from '../users/user.entity'; 
import { Comment } from '../comments/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cards')
export class Card {
  @ApiProperty({ description: 'ID карточки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Название карточки' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Описание карточки', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Позиция карточки', default: 0 })
  @Column({ default: 0 })
  position: number;

  @ApiProperty({ description: 'ID колонки' })
  @Index()
  @Column()
  column_id: number;

  @ApiProperty({ description: 'ID пользователя (автора)' })
  @Index()
  @Column()
  user_id: number;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ColumnEntity, (column) => column.cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'column_id' })
  column: ColumnEntity;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.card)
  comments: Comment[];
}


