import { Currency } from './currency';
import { Exchange } from './exchange';

export interface FromToMarketRequest {
  from: string;
  to: string;
}

export class Market {
  name: string;
  from: Currency;
  to: Currency;
  updated: Date;
  exchanges: Exchange[];
}
