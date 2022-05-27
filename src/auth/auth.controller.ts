import { GetUser } from './../common/getUser.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoUserDto } from './dto/kakao-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/kakao/logout')
  @UseGuards(JwtAuthGuard)
  async kakaoLogout(@GetUser() user: KakaoUserDto): Promise<object> {
    return await this.authService.kakaoLogout(user);
}
