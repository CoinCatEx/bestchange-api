import { Injectable } from '@nestjs/common';
import { Currency } from '../../models/currency';
import { plainToClass } from 'class-transformer';
import { Rate } from '../../models/rate';
import { BExchange } from '../../models/bexchange';
import { Iconv } from 'iconv';

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
    return this.convertToDate(this.getData(data)[0][0].split('=')[1], 3);
  }

  convertToDate(str: string, gmt = 0): Date {
    const dateArr = str.split(', ');
    const hoursArr = dateArr[0].split(':');
    const mArr = dateArr[1].split(' ');
    const date = new Date();
    date.setMonth(this.mapMonth(mArr[1]));
    date.setDate(parseInt(mArr[0], 10));
    date.setHours(parseInt(hoursArr[0], 10));
    date.setMinutes(parseInt(hoursArr[1], 10));
    date.setSeconds(parseInt(hoursArr[2], 10));
    const year = date.getFullYear();
    date.setHours(date.getHours() - gmt);
    date.setFullYear(year);
    console.log(`got ${date.toString()} updated`);
    return date;
  }

  private getData(data: Buffer): any[][] {
    const conv = Iconv('windows-1251', 'utf8');
    const content = conv.convert(data).toString();
    const lines = content.split(/\r?\n/g);
    return lines.map(line => line.split(';'));
  }

  private mapMonth(month: string): number {
    switch (month) {
      case 'января':
        return 0;
      case 'февраля':
        return 1;
      case 'марта':
        return 2;
      case 'апреля':
        return 3;
      case 'мая':
        return 4;
      case 'июня':
        return 5;
      case 'июля':
        return 6;
      case 'августа':
        return 7;
      case 'сентября':
        return 8;
      case 'октября':
        return 9;
      case 'ноября':
        return 10;
      case 'декабря':
        return 11;
    }
  }
}
