import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from './entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findOwn(@Req() req: Request & { user: User }) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: User },
  ) {
    return await this.usersService.updateById(req.user.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getOwnWishes(@Req() req: Request & { user: User }) {
    return await this.wishesService.findByUserId(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username, false);
  }

  @Get(':username/wishes')
  getWishes(@Param('username') username: string) {
    return this.wishesService.findByUserName(username);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  findMany(@Body() findUserDto: FindUserDto) {
    return this.usersService.findUser(findUserDto.query);
  }
}
