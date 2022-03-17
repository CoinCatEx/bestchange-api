import { Injectable } from '@nestjs/common';
import { Currency } from '../../models/currency';
import { Rate } from '../../models/rate';
import { BExchange } from '../../models/bexchange';
import { StaticPool } from 'node-worker-threads-pool';

@Injectable()
export class DataService {
  private workerDecompress = new StaticPool({
    size: 1,
    task: __dirname + '/../../worker.js',
    workerData: {
      path: './modules/data/decompress-worker',
    },
  });
  private workerExchanges = new StaticPool({
    size: 1,
    task: __dirname + '/../../worker.js',
    workerData: {
      path: './modules/data/exchanges-worker',
    },
  });
  private worderRates = new StaticPool({
    size: 1,
    task: __dirname + '/../../worker.js',
    workerData: {
      path: './modules/data/rates-worker',
    },
  });
  private worderCurrencies = new StaticPool({
    size: 1,
    task: __dirname + '/../../worker.js',
    workerData: {
      path: './modules/data/currencies-worker',
    },
  });

  constructor() {}

  async getCurrencies(currencies: Buffer, codes: Buffer): Promise<Currency[]> {
    console.log(`obtaining currencies from Buffer...`);
    const cs = await this.worderCurrencies.exec({
      currencies: await this.getData(currencies),
      codes: await this.getData(codes),
    });
    console.log(`got ${cs.length} currencies`);
    return cs;
  }

  async getRates(data: Buffer): Promise<Rate[]> {
    console.log(`obtaining rates from Buffer...`);
    const rates = await this.worderRates.exec({
      data: await this.getData(data),
    });
    console.log(`got ${rates.length} rates`);
    return rates;
  }

  async getExchanges(data: Buffer): Promise<BExchange[]> {
    console.log(`obtaining exchanges from Buffer...`);
    const exchanges = await this.workerExchanges.exec({
      data: await this.getData(data),
    });
    console.log(`got ${exchanges.length} exchanges`);
    return exchanges;
  }

  async getUpdated(data: Buffer): Promise<Date> {
    console.log(`obtaining updated from Buffer...`);
    return this.convertToDate(
      (await this.getData(data))[0][0].split('=')[1],
      3,
    );
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

  private async getData(data: Buffer): Promise<any[][]> {
    return this.workerDecompress.exec({
      data,
    });
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
