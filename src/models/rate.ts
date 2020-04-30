import BigNumber from 'bignumber.js';
import { Transform } from 'class-transformer';

export class Rate {
  from: string;
  to: string;
  exchangeId: string;

  @Transform(val => new BigNumber(val))
  priceFrom: BigNumber;

  @Transform(val => new BigNumber(val))
  priceTo: BigNumber;

  @Transform(val => new BigNumber(val))
  reserve: BigNumber;

  @Transform(val => new BigNumber(val))
  reviews: BigNumber;
}
