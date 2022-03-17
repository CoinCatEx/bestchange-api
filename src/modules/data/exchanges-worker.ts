import { parentPort, workerData } from 'worker_threads';
import { decode } from 'iconv-lite';
import { plainToClass } from 'class-transformer';
import { BExchange } from '../../models/bexchange';

parentPort.on('message', ({ data }) => {
  parentPort.postMessage(
    data.map(item => {
      return plainToClass(BExchange, {
        id: item[0],
        name: item[1],
      });
    }),
  );
});
