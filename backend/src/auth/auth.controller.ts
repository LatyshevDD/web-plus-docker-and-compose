import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { LocalGuard } from '../guards/local.guard';
import { User } from '../users/entities/user.entity';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @UseGuards(LocalGuard)
  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@Req() req: { user: User }) {
    return this.authService.auth(req.user);
  }
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
