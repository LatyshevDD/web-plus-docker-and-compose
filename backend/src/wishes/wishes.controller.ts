import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() createWishDto: CreateWishDto,
    @Req() req: Request & { user: User },
  ) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request & { user: User }) {
    const isOwner = await this.wishesService.checkOwner(id, req.user.id);
    return await this.wishesService.findOneWihUser(id, isOwner);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishesService.checkOwner(id, req.user.id);
    if (!isOwner) {
      throw new ForbiddenException('Вы можете изменять только свои wishes');
    }
    if (updateWishDto.price) {
      const isOffers = await this.wishesService.checkOffers(id);
      if (isOffers) {
        throw new ForbiddenException(
          'Нельзя изменять цену на подарки, для которых есть offer',
        );
      }
    }
    return await this.wishesService.update(id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishesService.checkOwner(id, req.user.id);
    if (!isOwner) {
      throw new ForbiddenException('Вы можете удалять только свои wishes');
    }
    return this.wishesService.removeOne(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishesService.checkOwner(id, req.user.id);
    if (isOwner) {
      throw new ForbiddenException('Вы не можете копировать свои wishes');
    }
    const wish = await this.wishesService.findOne(id);
    await this.wishesService.updateCopied(id);
    return await this.wishesService.create(
      {
        name: wish.name,
        link: wish.link,
        image: wish.image,
        price: wish.price,
        description: wish.description,
      },
      req.user,
    );
  }
}
