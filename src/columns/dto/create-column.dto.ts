import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, IsOptional, Min } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Название колонки',
    example: 'To Do',
    maxLength: 255,
  })
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MaxLength(255, { message: 'Название не должно превышать 255 символов' })
  title: string;

  @ApiProperty({
    description: 'Позиция колонки для сортировки',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Позиция должна быть целым числом' })
  @Min(0, { message: 'Позиция не может быть отрицательной' })
  position?: number;
}

