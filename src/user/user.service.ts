import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import { User } from './entities/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Connection, Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { isEmail } from 'class-validator';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly connection: Connection,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { email, nickname, password, confirmPassword } = createUserDto;

      if (password !== confirmPassword)
        throw new Error('Check Confirm Password');
      if (await this.userRepository.findOne({ where: { email } }))
        throw new Error('Duplicated Email');

      const newUser = this.userRepository.create({
        email,
        password: md5(password),
        nickname,
      });
      const result = await this.userRepository.save(newUser);
      delete result.password;
      return result;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async signIn(signInDto: SignInDto) {
    try {
      const [secretKey, duration] = [
        this.configService.get('JWT_SECRET_KEY'),
        this.configService.get('JWT_DURATION'),
      ];
      const { email, password } = signInDto;
      const user = await this.userRepository.findOneOrFail({
        where: { email },
      });
      if (user.password !== md5(password)) throw new Error('Invalid Password');

      const accessToken = jwt.sign(String(user.id), secretKey, {
        expiresIn: duration,
      });

      return accessToken;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const { email, token, password } = resetPasswordDto;
      const user = await this.userRepository
        .createQueryBuilder()
        .where('email = :email', { email })
        .andWhere('resetPasswordToken = :token', { token })
        .andWhere('resetPasswordDuration < now()')
        .select('id')
        .getOneOrFail();

      await this.userRepository
        .createQueryBuilder()
        .update()
        .set({
          resetPasswordDuration: () => null,
          resetPasswordToken: () => null,
          password: () => md5(password),
        })
        .where('id = :id', { id: user.id })
        .execute();

      return await this.signIn({ email, password });
    } catch (err) {
      throw new BadRequestException(err.message || err);
    }
  }

  async resetPasswordMail(email) {
    try {
      if (!isEmail(email)) throw new Error('Need Proper Email');
      const user = await this.userRepository
        .createQueryBuilder()
        .where('email = :email', { email })
        .getOneOrFail();

      const resetPasswordToken = uuid();
      await this.userRepository
        .createQueryBuilder()
        .update()
        .where('id = :id', { id: user.id })
        .set({
          resetPasswordDuration: () => 'addDate(now(), interval 1 day)',
          resetPasswordToken: () => resetPasswordToken,
        })
        .execute();

      const EMAIL = this.configService.get('EMAIL');
      const EMAIL_PASSWORD = this.configService.get('EMAIL_PASSWORD');
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: EMAIL,
        to: email,
        subject: 'token for password reset',
        html: `<h1>token: ${resetPasswordToken}}</h1>`,
      };

      transport.sendMail(mailOptions, (error) => {
        if (error) throw new Error(`${error}`);
      });

      return { success: true };
    } catch (err) {
      throw new BadRequestException(err.message || err);
    }
  }
}
