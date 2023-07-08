import { IsBoolean, IsInt, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden?: boolean;

  @IsInt()
  itemId: number;
}
