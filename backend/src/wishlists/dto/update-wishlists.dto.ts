import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateWishlistsDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  itemsId: string[];
}
