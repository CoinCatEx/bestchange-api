import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import * as fs from 'fs';
import * as http from 'http';
import { exec } from 'child_process';

@Injectable()
export class FetcherService {
  constructor() {}

  fetchData(uri: string, path: string): Observable<string> {
    console.log(`fetching data from uri ${uri}`);
    const result = new Subject<string>();
    const dirArr = path.split('/');
    const file = dirArr.pop();
    const dir = dirArr.join('/');
    const fileBackup = `${file}.backup`;
    const command = `aria2c --remove-control-file=true --always-resume=false --allow-overwrite=true --check-certificate=false --dir ${
      dir.length ? dir : './'
    } -x 10 -s 10 -o ${file} ${uri} && mv -f ${[...dirArr, file].join('/')} ${[
      ...dirArr,
      fileBackup,
    ].join('/')}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`error fetching data from uri ${uri}`);
        result.error(err);
        result.complete();
        return;
      }

      console.log(`data fetched from uri ${uri}`);
      result.next(fileBackup);
      result.complete();
    });
    return result;
  }
}
