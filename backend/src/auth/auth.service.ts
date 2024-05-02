import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HelpersService } from '../helpers/helpers.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private helpersService: HelpersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
  async validatePassword(username: string, password: string) {
    let user: User;
    try {
      user = await this.usersService.findByUsername(username, true);
    } catch (error) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    const matched = await this.helpersService.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return user;
  }
}
