import { Module } from '@nestjs/common';
import { FetcherService } from './fetcher.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FetcherService],
  exports: [FetcherService],
})
export class FetcherModule {}
