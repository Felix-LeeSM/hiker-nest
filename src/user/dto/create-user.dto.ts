import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'asdfme@gmail.com',
    description: '유저 이메일',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  @ApiProperty({
    example: '이것은닉네임이다',
    description: '유저 닉네임 5~15글자',
  })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(30)
  @ApiProperty({
    example: 'asdfernsg',
    description: '유저 비밀번호',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty({
    example: 'asdfernsg',
    description: '유저 비밀번호 확인',
  })
  confirmPassword: string;
}
