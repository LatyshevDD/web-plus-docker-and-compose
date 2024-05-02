import { IsNumber, IsString } from 'class-validator';

export class CreateWishDto {
  @IsString()
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;
}
