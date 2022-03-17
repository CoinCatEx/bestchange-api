import { parentPort, workerData } from 'worker_threads';
import { decode } from 'iconv-lite';
import { Subject } from 'rxjs';
import { exec } from 'child_process';

parentPort.on('message', ({ uri, path }) => {
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
      parentPort.postMessage(null);
    } else {
      console.log(`data fetched from uri ${uri}`);
      parentPort.postMessage(fileBackup);
    }
  });
});
