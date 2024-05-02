import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsString()
  itemId: string;
}
