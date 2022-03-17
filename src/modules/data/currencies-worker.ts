import { parentPort, workerData } from 'worker_threads';
import { plainToClass } from 'class-transformer';
import { Rate } from '../../models/rate';
import { Currency } from '../../models/currency';

parentPort.on('message', ({ codes, currencies }) => {
  const mapper: { [key: string]: Currency } = {};
  const codesMap = codes.reduce((acc, curr) => {
    acc[curr[0]] = curr[1];
    return acc;
  }, {});
  const cs = currencies.map(item => {
    let code = codesMap[item[0]];
    if (code.includes('(')) {
      code = item[3];
    }
    const c = plainToClass(Currency, {
      id: item[0],
      code,
    });
    mapper[c.id] = c;
    return c;
  });
  currencies.forEach(item => {
    mapper[item[0]].linkCode = item[1];
  });
  parentPort.postMessage(cs);
});
