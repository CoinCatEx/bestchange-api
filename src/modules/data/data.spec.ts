import { Test, TestingModule } from '@nestjs/testing';
import { DataModule } from './data.module';
import { DataService } from './data.service';
import { Iconv } from 'iconv';

describe('Data spec', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [DataModule],
      controllers: [],
      providers: [DataService],
    }).compile();
  });

  describe('data testing', () => {
    it('convert string date to local time', done => {
      const dataService = app.get<DataService>(DataService);
      const d = '15:59:26, 10 марта';
      const expected = new Date(1615370366000);
      expected.setMilliseconds(0);
      const res = dataService.convertToDate(d, 3);
      res.setMilliseconds(0);
      expect(res.getTime()).toEqual(expected.getTime());
      done();
    }, 10000000);
  });
});
