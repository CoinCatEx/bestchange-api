import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as http from 'http';

@Injectable()
export class FetcherService {
  constructor() {}

  fetchData(uri: string, path: string): Observable<string> {
    console.log(`fetching data from uri ${uri}`);
    const result = new Subject<string>();
    const file = fs.createWriteStream(path);
    http
      .get(uri, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          console.log(`data fetched from uri ${uri}`);
          file.close();
          result.next(path);
        });
      })
      .on('error', (err) => {
        // Handle errors
        console.error(`can't fetch data from uri ${uri}`, err);
        fs.unlink(path, _ => {});
        result.error(err.message);
      });
    return result;
  }
}
