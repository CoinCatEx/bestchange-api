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
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('data testing', () => {
    it('test new year date', done => {
      jest.setSystemTime(new Date('12.31.2021 23:57:26'));

      const dataService = app.get<DataService>(DataService);
      const d = '02:57:26, 1 января';
      const expected = new Date('12.31.2021 23:57:26');
      expected.setMilliseconds(0);
      const res = dataService.convertToDate(d, 3);
      res.setMilliseconds(0);
      expect(res.getTime()).toEqual(expected.getTime());
      done();
    }, 10000000);

    it('test before new year date', done => {
      jest.setSystemTime(new Date('12.31.2021 20:57:26'));

      const dataService = app.get<DataService>(DataService);
      const d = '23:57:26, 31 декабря';
      const expected = new Date('12.31.2021 20:57:26');
      expected.setMilliseconds(0);
      const res = dataService.convertToDate(d, 3);
      res.setMilliseconds(0);
      expect(res.getTime()).toEqual(expected.getTime());
      done();
    }, 10000000);
  });
});
