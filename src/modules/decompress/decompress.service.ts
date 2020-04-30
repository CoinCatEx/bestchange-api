import { Injectable } from '@nestjs/common';
import { Decompressed } from '../../models/decompressed';
import * as AdmZip from 'adm-zip';
import { forkJoin, Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable()
export class DecompressService {
  constructor() {}

  getFilesData(filePath: string): Observable<Decompressed[]> {
    console.log(`decompressing file...`);
    const zip = new AdmZip(filePath);
    console.log(`successfully decompressed`);
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
    console.log(`getting file data ${entry.name}...`);
    const result = new Subject<Buffer>();
    entry.getDataAsync(data => {
      console.log(`received file data ${entry.name}...`);
      result.next(data);
    });
    return result;
  }
}
