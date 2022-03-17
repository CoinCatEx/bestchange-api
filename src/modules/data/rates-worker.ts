import { parentPort, workerData } from 'worker_threads';

parentPort.on('message', ({ data }) => {
  parentPort.postMessage(
    data.map(item => ({
      from: item[0],
      to: item[1],
      exchangeId: item[2],
      priceFrom: item[3],
      priceTo: item[4],
      reserve: item[5],
      reviews: item[6],
    })),
  );
});
