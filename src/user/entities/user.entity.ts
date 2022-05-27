import { Common } from '../../common/common.entity';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'User' })
export class User extends Common {
  @Column('varchar', {
    name: 'email',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('varchar', {
    name: 'nickname',
    length: 15,
    nullable: false,
  })
  nickname: string;

  @Column('varchar', {
    name: 'password',
    length: 50,
    nullable: false,
  })
  password: string;

  @Column('varchar', {
    name: 'resetPasswordToken',
    nullable: true,
  })
  resetPasswordToken: string;

  @Column('datetime', {
    name: 'resetPasswordDuration',
    nullable: true,
  })
  resetPasswordDuration: Date;

  @Column('tinyint', {
    name: 'isValid',
    width: 1,
    default: 1,
  })
  isValid: number;

  @Column('int', {
    name: 'kakaoId',
    unsigned: true,
    nullable: true,
  })
  kakaoId: number;
}
