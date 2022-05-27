import { User } from './../../../user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY,
      // 전달되는 토큰 가져오기
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload) {
    const { id, kakaoAccessToken } = payload;
    // const user = await this.authRepository.findOneById(_id);
    const user = id;
    if (!user) {
      throw new UnauthorizedException({ msg: '사이트 회원이 아닙니다.' });
    }

    let userObj = {};

    if (payload.hasOwnProperty('kakaoAccessToken')) {
      userObj = {
        kakaoAccessToken,
        user,
      };
    } else {
      userObj = {
        kakaoAccessToken: null,
        user,
      };
    }

    return userObj;
  }
}
