import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  @IsOptional()
  description: string;
}
