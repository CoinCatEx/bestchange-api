import { parentPort, workerData } from 'worker_threads';
import { decode } from 'iconv-lite';

parentPort.on('message', ({ data }) => {
  const content = decode(data, 'win1251');
  const lines = content.split(/\r?\n/g);
  parentPort.postMessage(lines.map(line => line.split(';')));
});
