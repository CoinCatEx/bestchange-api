import { Injectable } from '@nestjs/common';
import { Decompressed } from '../../models/decompressed';
import * as AdmZip from 'adm-zip';
import { forkJoin, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class DecompressService {
  constructor() {}

  getFilesData(filePath: string): Observable<Decompressed[]> {
    const zip = new AdmZip(filePath);
    const entries = zip.getEntries();
    return forkJoin(
      entries.map(entry =>
        this.getData(entry).pipe(
          map(data => ({
            fileName: entry.entryName,
            data,
          })),
          first(),
        ),
      ),
    );
  }

  private getData(entry: AdmZip.IZipEntry): Observable<Buffer> {
    const result = new Subject<Buffer>();
    entry.getDataAsync(data => {
      result.next(data);
    });
    return result;
  }
}
