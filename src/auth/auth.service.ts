import { KakaoUserDto } from './dto/kakao-user.dto';

import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async kakaoLogout(kakaoUserDto: KakaoUserDto) {
    const KAKAO_ACCESS_TOKEN = kakaoUserDto.kakaoAccessToken;
    const _url = 'https://kapi.kakao.com/v1/user/unlink';
    const _header = { Authorization: `bearer ${KAKAO_ACCESS_TOKEN}` };
    try {
      this.httpService.post(_url, '', { headers: _header });
      return {
        msg: '카카오 로그아웃 완료',
      };
    } catch (error) {
      return error;
    }
  }
}
