import { ResetPasswordDto } from './dto/reset-password.dto';
import { Controller, Post, Body, ValidationPipe, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '회원가입',
  })
  @Post()
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.signUp(createUserDto);
  }

  @ApiOperation({
    summary: '로그인',
  })
  @Post('signin')
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.userService.signIn(signInDto);
  }

  @ApiOperation({
    summary: '비밀번호 초기화',
  })
  @Patch('reset')
  resetPassword(@Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({
    summary: '비밀번호 초기화 메일 요청',
    description: '비밀번호 초기화 메일로 요청하기',
  })
  @Post('reset')
  resetPasswordMail(@Body('email') email: string) {
    return this.userService.resetPasswordMail(email);
  }
}
