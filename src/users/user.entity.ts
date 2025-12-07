import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, BeforeInsert, BeforeUpdate, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Column as ColumnEntity } from '../columns/column.entity';
import { Card } from '../cards/card.entity';
import { Comment } from '../comments/comment.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Уникальный идентификатор пользователя' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Email пользователя' })
  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // исключает пароль из json
  password: string;

  @ApiProperty({ description: 'Имя пользователя', required: false })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  @OneToMany(() => ColumnEntity, (column) => column.user)
  columns: ColumnEntity[];

  @OneToMany(() => Card, (card) => card.user)
  cards: Card[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}

