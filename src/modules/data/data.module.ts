import { Module } from '@nestjs/common';
import { DataService } from './data.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule {}
