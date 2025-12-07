import { IsEmail, IsNotEmpty, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'Qwerty123',
    minLength: 6,
    maxLength: 30,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @Length(6, 30, { message: 'Пароль должен содержать от 6 до 30 символов' })
  password: string;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Юзер Экземплович',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;
}