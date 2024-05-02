import { IsBoolean, IsOptional } from 'class-validator';

export class RelationsWishDto {
  @IsBoolean()
  @IsOptional()
  offers?: boolean;

  @IsBoolean()
  @IsOptional()
  owner?: boolean;

  @IsBoolean()
  @IsOptional()
  wishlists?: boolean;
}
