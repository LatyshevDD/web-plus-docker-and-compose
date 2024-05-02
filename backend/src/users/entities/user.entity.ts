import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlists.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsString()
  @Length(2, 30, {
    message: 'Длинна строки должна составлять от 2 до 30 символов',
  })
  username: string;

  @Column({
    type: 'varchar',
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @Length(2, 200, {
    message: 'Длинна строки должна составлять от 2 до 200 символов',
  })
  @IsOptional()
  about: string;

  @Column({
    type: 'varchar',
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl({ message: 'Значение должно быть ссылкой' })
  @IsOptional()
  avatar: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  @IsEmail({ message: 'Значение должно быть адресом электронной почты' })
  email: string;

  @Column({
    select: false,
  })
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
