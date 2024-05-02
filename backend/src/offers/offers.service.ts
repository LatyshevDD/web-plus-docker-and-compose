import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { validate } from 'class-validator';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User, wish: Wish) {
    const offer = this.offersRepository.create({
      user: user,
      amount: createOfferDto.amount,
      hidden: createOfferDto.hidden,
      item: wish,
    });
    const errors = await validate(offer);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }
    await this.offersRepository.save(offer);
  }

  async findAll() {
    return await this.offersRepository.find({
      where: {
        hidden: false,
      },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async findOne(id: string) {
    try {
      return await this.offersRepository.findOne({
        where: { id, hidden: false },
        relations: { user: true, item: true },
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '22P02') {
          throw new BadRequestException('Offer с таким id не найден!');
        }
      }
    }
  }
}
