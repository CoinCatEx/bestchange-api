import { Test, TestingModule } from '@nestjs/testing';
import { DecompressModule } from './decompress.module';
import { DecompressService } from './decompress.service';

describe('Decompress spec', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [DecompressModule],
      controllers: [],
      providers: [DecompressService],
    }).compile();
  });

  describe('decompress testing', () => {
    it('should fetch files', done => {
      const decompressService = app.get<DecompressService>(DecompressService);
      decompressService
        .getFilesData('src/modules/decompress/test.zip')
        .subscribe(
          files => {
            expect(files.length).toBe(2);
            expect(files[0].data.toString('utf-8')).toBe('hey there');
            done();
          },
          error => {
            done.fail(error);
          },
        );
    }, 10000000);
  });
});
