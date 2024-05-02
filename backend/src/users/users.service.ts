import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { HelpersService } from '../helpers/helpers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private helpersService: HelpersService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    const errors = await validate(user);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }
    user.password = await this.helpersService.hash(createUserDto.password);
    try {
      const newuser = await this.usersRepository.save(user);
      return newuser;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async updateById(id: string, updateUserDto: UpdateUserDto) {
    let existUser: User;
    try {
      existUser = await this.usersRepository.findOne({
        select: {
          username: true,
          password: true,
          id: true,
          about: true,
          avatar: true,
          email: true,
        },
        where: { id },
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '22P02') {
          throw new BadRequestException('Пользователь с таким id не найден!');
        }
      }
    }

    let newPassword: string;

    if (updateUserDto.password) {
      newPassword = await this.helpersService.hash(updateUserDto.password);
    }

    const updatedUser = {
      id: existUser.id,
      username: updateUserDto.username
        ? updateUserDto.username
        : existUser.username,
      about: updateUserDto.about ? updateUserDto.about : existUser.about,
      avatar: updateUserDto.avatar ? updateUserDto.avatar : existUser.avatar,
      email: updateUserDto.email ? updateUserDto.email : existUser.email,
      password: newPassword ? newPassword : existUser.password,
    };

    const user = this.usersRepository.create(updatedUser);

    const errors = await validate(user);
    if (errors.length > 0) {
      const messages = errors.map((error) => error.constraints);
      throw new BadRequestException(messages);
    }

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const err = error.driverError;
        if (err.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }

  async findByUsername(username: string, password: boolean) {
    let user: User;
    try {
      user = await this.usersRepository.findOneOrFail({
        select: {
          username: true,
          password: password,
          id: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
        where: { username },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException('Пользователь с таким именем не найден!');
      }
    }
    return user;
  }

  async findOne(id: string) {
    return await this.usersRepository.findOneOrFail({
      where: { id },
      relations: { wishes: true, offers: true, wishlists: true },
    });
  }

  async findUser(query: string) {
    let user: User;
    try {
      user = await this.usersRepository.findOneOrFail({
        select: {
          username: true,
          id: true,
          about: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          email: true,
        },
        where: [{ email: query }, { username: query }],
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException('Пользователь с таким email не найден!');
      }
    }
    return user;
  }
}
