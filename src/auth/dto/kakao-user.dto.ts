import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class KakaoUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string | null;

  @IsString()
  @IsNotEmpty()
  kakaoId: string;

  @IsString()
  @IsNotEmpty()
  kakaoAccessToken: string;

  @IsString()
  provider: string;

  @IsString()
  profileUrl: string;
}
