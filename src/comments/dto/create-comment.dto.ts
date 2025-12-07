import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty , MaxLength} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ 
    description: 'Содержание комментария',
    example: 'Это очень важная задача, нужно её выполнить до конца этой недели',
    maxLength: 1000,
  })
  @IsString({ message: 'Содержание комментария должно быть строкой' })
  @IsNotEmpty({ message: 'Содержание комментария не может быть пустым' })
  @MaxLength(1000, { message: 'Комментарий может содержать не более 1000 символов' })
  content: string;
}