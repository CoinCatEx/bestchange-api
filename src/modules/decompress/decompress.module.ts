import { Module } from '@nestjs/common';
import { DecompressService } from './decompress.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DecompressService],
  exports: [DecompressService],
})
export class DecompressModule {}
