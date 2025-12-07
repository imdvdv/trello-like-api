import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, IsOptional, Min } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({
    description: 'Название карточки',
    example: 'Написать API',
    maxLength: 255,
  })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MaxLength(255, { message: 'Название не должно превышать 255 символов' })
  title: string;

  @ApiPropertyOptional({
    description: 'Описание карточки',
    example: 'Создать RESTful API с авторизацией для trello на nestjs',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Позиция карточки для сортировки',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Позиция должна быть целым числом' })
  @Min(0, { message: 'Позиция не может быть отрицательной' })
  position?: number;
}

