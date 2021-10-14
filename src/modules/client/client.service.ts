import { Injectable } from '@nestjs/common';
import { DecompressService } from '../decompress/decompress.service';
import { FetcherService } from '../fetcher/fetcher.service';
import { DataService } from '../data/data.service';
import { Observable, of, ReplaySubject, timer } from 'rxjs';
import { expand, first, map, switchMap, tap, timeout } from 'rxjs/operators';
import { Currency } from '../../models/currency';
import { Market } from '../../models/markets';
import { Rate } from '../../models/rate';
import { plainToClass } from 'class-transformer';
import { Exchange } from '../../models/exchange';
import { BExchange } from '../../models/bexchange';

@Injectable()
export class ClientService {
  private readonly WATCH_TIME = parseInt(
    process.env.WATCH_TIME_INTERVAL_MS,
    10,
  );
  private readonly API_URI = process.env.API_URI;

  private readonly FILE_NAME = 'data.zip';
  private readonly FILE_CURRECNIES = 'bm_cy.dat';
  private readonly FILE_CURRECNIES_CODES = 'bm_cycodes.dat';
  private readonly FILE_RATES = 'bm_rates.dat';
  private readonly FILE_INFO = 'bm_info.dat';
  private readonly FILE_EXCHANGE = 'bm_exch.dat';

  private currecnies$ = new ReplaySubject<Currency[]>(1);
  private markets$ = new ReplaySubject<Market[]>(1);

  constructor(
    private decompressSerice: DecompressService,
    private fetcherSerice: FetcherService,
    private dataSerice: DataService,
  ) {
    this.runObserver();
  }

  private runObserver() {
    of(true)
      .pipe(
        expand(() =>
          this.updateData().pipe(switchMap(() => timer(this.WATCH_TIME))),
        ),
      )
      .subscribe(
        () => {},
        err => {
          console.log(`error occurred during fetching rates`);
          console.log(err);
          this.runObserver();
        },
      );
  }

  private updateData(): Observable<boolean> {
    return this.fetcherSerice.fetchData(this.API_URI, this.FILE_NAME).pipe(
      switchMap(path => this.decompressSerice.getFilesData(path)),
      tap(files => {
        const cyFile = files.find(f => f.fileName === this.FILE_CURRECNIES)
          .data;
        const cyCodeFile = files.find(
          f => f.fileName === this.FILE_CURRECNIES_CODES,
        ).data;
        const currencies = this.dataSerice.getCurrencies(cyFile, cyCodeFile);
        this.currecnies$.next(currencies);

        const infoFile = files.find(f => f.fileName === this.FILE_INFO).data;
        const ratesFile = files.find(f => f.fileName === this.FILE_RATES).data;
        const exchangesFile = files.find(f => f.fileName === this.FILE_EXCHANGE)
          .data;
        const rates = this.dataSerice.getRates(ratesFile);
        const updated = this.dataSerice.getUpdated(infoFile);
        const bexchs = this.dataSerice.getExchanges(exchangesFile);
        const markets = this.prepareMarkets(rates, currencies, bexchs, updated);
        this.markets$.next(markets);
      }),
      map(() => true),
      timeout(60 * 2 * 1000),
    );
  }

  private prepareMarkets(
    rates: Rate[],
    currencies: Currency[],
    bexchs: BExchange[],
    updated: Date,
  ): Market[] {
    const cMap: { [key: string]: Currency } = {};
    const rMap: { [key: string]: Market } = {};
    const eMap: { [key: string]: BExchange } = {};
    currencies.forEach(c => {
      cMap[c.id] = c;
    });
    bexchs.forEach(e => {
      eMap[e.id] = e;
    });
    rates.forEach(rate => {
      if (eMap[rate.exchangeId].name.toLowerCase() !== 'coincat') {
        const from = cMap[rate.from];
        const to = cMap[rate.to];
        const name = `${from.code}-${to.code}`;
        if (!rMap[name]) {
          rMap[name] = plainToClass(Market, {
            name,
            from,
            to,
            exchanges: [],
          });
        }
        rMap[name].updated = updated;
        rMap[name].exchanges.push(
          plainToClass(Exchange, {
            name: eMap[rate.exchangeId].name,
            priceFrom: rate.priceFrom,
            priceTo: rate.priceTo,
            reserve: rate.reserve,
          }),
        );
      }
    });
    return Object.values(rMap);
  }

  getMarkets(): Observable<Market[]> {
    return this.markets$.pipe(first());
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currecnies$.pipe(first());
  }
}
