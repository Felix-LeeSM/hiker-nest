import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class ResetPasswordDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: '메일로 보내준 token값',
  })
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'newPassword',
    description: '새로운 비밀번호',
  })
  password: string;
}
