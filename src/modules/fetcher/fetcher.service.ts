import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { StaticPool } from 'node-worker-threads-pool';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class FetcherService {
  private workerFetcher = new StaticPool({
    size: 1,
    task: __dirname + '/../../worker.js',
    workerData: {
      path: './modules/fetcher/download-worker',
    },
  });

  constructor() {}

  fetchData(uri: string, path: string): Observable<string> {
    console.log(`fetching data from uri ${uri}`);
    return fromPromise(
      this.workerFetcher.exec({
        uri,
        path,
      }),
    );
  }
}
