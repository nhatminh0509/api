import { Module } from '@nestjs/common';
import { FilesService } from './service';
import { FilesController } from './controller';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
