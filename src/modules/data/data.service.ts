import { Injectable } from '@nestjs/common';
import { Currency } from '../../models/currency';
import { plainToClass } from 'class-transformer';
import { Rate } from '../../models/rate';
import * as moment from 'moment';
import { BExchange } from '../../models/bexchange';

@Injectable()
export class DataService {
  constructor() {}

  getCurrencies(currecies: Buffer, codes: Buffer): Currency[] {
    console.log(`obtaining currencies from Buffer...`);
    let mapper: { [key: string]: Currency } = {};
    const cs = this.getData(currecies).map(item => {
      let code = item[2];
      if (code.includes('(')) {
        code = item[3];
      }
      const c = plainToClass(Currency, {
        id: item[0],
        code,
      });
      mapper[c.id] = c;
      return c;
    });
    this.getData(currecies).forEach(item => {
      mapper[item[0]].linkCode = item[1];
    });
    console.log(`got ${cs.length} currencies`);
    return cs;
  }

  getRates(data: Buffer): Rate[] {
    console.log(`obtaining rates from Buffer...`);
    const rates = this.getData(data).map(item => {
      return plainToClass(Rate, {
        from: item[0],
        to: item[1],
        exchangeId: item[2],
        priceFrom: item[3],
        priceTo: item[4],
        reserve: item[5],
        reviews: item[6],
      });
    });
    console.log(`got ${rates.length} rates`);
    return rates;
  }

  getExchanges(data: Buffer): BExchange[] {
    console.log(`obtaining exchanges from Buffer...`);
    const exchanges = this.getData(data).map(item => {
      return plainToClass(BExchange, {
        id: item[0],
        name: item[1],
      });
    });
    console.log(`got ${exchanges.length} rates`);
    return exchanges;
  }

  getUpdated(data: Buffer): Date {
    console.log(`obtaining updated from Buffer...`);
    const s = this.getData(data)[0][0].split('=')[1];
    const m = moment(s, 'h:mm:ss, DD MMMM');
    console.log(`got ${m.toISOString()} updated`);
    return m.toDate();
  }

  private getData(data: Buffer): any[][] {
    const content = data.toString('utf-8');
    const lines = content.split(/\r?\n/g);
    return lines.map(line => line.split(';'));
  }
}
