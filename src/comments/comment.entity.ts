import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Card } from '../cards/card.entity';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comments')
export class Comment {
  @ApiProperty({ description: 'ID комментария' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Содержание комментария' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'ID карточки' })
  @Index()
  @Column()
  card_id: number;

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

  @ManyToOne(() => Card, (card) => card.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: Card;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}


