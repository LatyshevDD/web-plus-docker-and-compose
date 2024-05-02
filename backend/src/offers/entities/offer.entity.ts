import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean, IsNumber } from 'class-validator';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.wishes)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'numeric' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Значение должно быть округлено до сотых' },
  )
  amount: number;

  @Column({
    default: false,
  })
  @IsBoolean({ message: 'Должно быть указано булевое значение' })
  hidden: boolean;
}
