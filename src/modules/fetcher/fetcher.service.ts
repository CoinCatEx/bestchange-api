import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as http from 'http';

@Injectable()
export class FetcherService {
  constructor() {}

  fetchData(uri: string, path: string): Observable<string> {
    const result = new Subject<string>();
    var file = fs.createWriteStream(path);
    http
      .get(uri, function(response) {
        response.pipe(file);
        file.on('finish', function() {
          file.close();
          result.next(path);
        });
      })
      .on('error', function(err) {
        // Handle errors
        fs.unlink(path, _ => {});
        result.error(err.message);
      });
    return result;
  }
}
