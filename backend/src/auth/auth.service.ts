import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt/dist';
import { TUserData } from '../common/types/types';
import { BcryptService } from '../common/services/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    readonly bcryptService: BcryptService,
  ) {}

  async validateUser(login: string, password: string): Promise<TUserData> {
    const user = await this.usersService.findOneByLogin(login);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    const isMatches = await this.bcryptService.compare(password, user.password);
    if (!isMatches) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return { id: user.id };
  }

  async login(user: TUserData): Promise<{ access_token: string }> {
    const payload = user;
    return { access_token: this.jwtService.sign(payload) };
  }
}
