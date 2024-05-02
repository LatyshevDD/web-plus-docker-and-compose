import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { IsString, IsUrl, Length } from 'class-validator';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsString()
  @Length(1, 250, {
    message: 'Длинна строки должна составлять от 1 до 250 символов',
  })
  name: string;

  @Column()
  @IsUrl({ message: 'Значение должно быть ссылкой' })
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlists)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
}
