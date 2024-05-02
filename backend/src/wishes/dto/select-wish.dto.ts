import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class SelectWishDto {
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

  @IsNumber()
  @IsOptional()
  raised: number;

  @IsInt()
  @IsOptional()
  copied: number;
}
