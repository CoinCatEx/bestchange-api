import { Test, TestingModule } from '@nestjs/testing';
import { FetcherModule } from './fetcher.module';
import { FetcherService } from './fetcher.service';

describe('Fetcher spec', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [FetcherModule],
      controllers: [],
      providers: [FetcherService],
    }).compile();
  });

  describe('fetcher testing', () => {
    it('should fetch files', done => {
      const fetcherService = app.get<FetcherService>(FetcherService);
      fetcherService
        .fetchData(
          'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',
          'src/modules/fetcher/1.jpg',
        )
        .subscribe(
          path => {
            expect(path.length).toBeGreaterThan(0);
            done();
          },
          error => {
            done.fail(error);
          },
        );
    }, 10000000);
  });
});
