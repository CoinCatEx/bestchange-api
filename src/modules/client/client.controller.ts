import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { first, map } from 'rxjs/operators';
import { Market } from '../../models/markets';
import { ClientService } from './client.service';
import { Currency } from '../../models/currency';

@Controller()
export class ClientController {
  constructor(private clientService: ClientService) {}

  @Get('')
  getMarkets(
    @Query('from') from: string,
    @Query('to') to: string,
  ): Observable<Market> {
    return this.clientService.getMarkets().pipe(
      map(markets =>
        markets.find(m => m.from.code === from && m.to.code === to),
      ),
      first(),
    );
  }

  @Get('/currencies')
  getCurrencies(): Observable<{ [key: string]: Currency }> {
    return this.clientService.getCurrencies().pipe(
      map(currencies =>
        currencies.reduce((acc, cur) => {
          acc[cur.code] = cur;
          return acc;
        }, {}),
      ),
    );
  }
}
