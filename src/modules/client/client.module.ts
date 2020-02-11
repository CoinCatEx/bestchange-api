import { Module } from '@nestjs/common';
import { FetcherModule } from '../fetcher/fetcher.module';
import { DecompressModule } from '../decompress/decompress.module';
import { ClientController } from './client.controller';
import { DataModule } from '../data/data.module';
import { ClientService } from './client.service';

@Module({
  imports: [FetcherModule, DecompressModule, DataModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
