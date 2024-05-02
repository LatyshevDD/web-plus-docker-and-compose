import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: Request & { user: User },
  ) {
    const isOwner = await this.wishesService.checkOwner(
      createOfferDto.itemId,
      req.user.id,
    );
    if (isOwner) {
      throw new ForbiddenException(
        'Не допускается скидываться на собственные подарки',
      );
    }
    await this.wishesService.checkRaised(
      createOfferDto.itemId,
      createOfferDto.amount,
    );
    await this.wishesService.checkPrice(
      createOfferDto.itemId,
      createOfferDto.amount,
    );
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    await this.offersService.create(createOfferDto, req.user, wish);
    await this.wishesService.updateRaised(
      createOfferDto.itemId,
      createOfferDto.amount,
    );
    return {};
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }
}
