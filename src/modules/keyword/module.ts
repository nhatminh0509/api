import { Global, Module } from '@nestjs/common';
import { KeywordService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { Keyword, KeywordSchema } from './model';
import { KeywordController } from './controller';

@Global()
@Module({
  controllers: [KeywordController],
  providers: [KeywordService],
  imports: [MongooseModule.forFeature([{ name: Keyword.name, schema: KeywordSchema }])],
  exports: [KeywordService]
})
export class KeywordModule {}
