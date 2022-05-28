import { Global, Module } from '@nestjs/common';
import { FilesService } from './service';
import { FilesController } from './controller';

@Global()
@Module({
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
