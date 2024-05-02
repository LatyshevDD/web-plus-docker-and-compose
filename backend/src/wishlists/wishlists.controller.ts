import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistsDto } from './dto/create-wishlists.dto';
import { UpdateWishlistsDto } from './dto/update-wishlists.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }
  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishlistsDto: CreateWishlistsDto,
    @Req() req: Request & { user: User },
  ) {
    const wishes = await this.wishesService.findManyById(
      createWishlistsDto.itemsId,
    );
    return this.wishlistsService.create(createWishlistsDto, req.user, wishes);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateWishlistsDto: UpdateWishlistsDto,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishlistsService.checkOwner(id, req.user.id);
    if (!isOwner) {
      throw new ForbiddenException('Допускется изменять только свои wishlists');
    }
    let wishes: Wish[];
    if (updateWishlistsDto.itemsId && updateWishlistsDto.itemsId.length > 0) {
      wishes = await this.wishesService.findManyById(
        updateWishlistsDto.itemsId,
      );
    }
    return this.wishlistsService.update(id, updateWishlistsDto, wishes);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async removeOne(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishlistsService.checkOwner(id, req.user.id);
    if (!isOwner) {
      throw new ForbiddenException('Удалять можно только свой wishlist');
    }
    return this.wishlistsService.removeOne(id);
  }
}
