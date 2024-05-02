import { IsArray, IsString, IsUrl } from 'class-validator';

export class CreateWishlistsDto {
  @IsString()
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsString({ each: true })
  itemsId: string[];
}
