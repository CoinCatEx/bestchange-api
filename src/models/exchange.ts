import BigNumber from 'bignumber.js';

export class Exchange {
  name: string;
  priceFrom: BigNumber;
  priceTo: BigNumber;
  reserve: BigNumber;
}
