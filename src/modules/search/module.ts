import { forwardRef, Global, Module } from '@nestjs/common';
import { SearchService } from './service';
import { SearchController } from './controller';
import { ProductsModule } from '../product/module';
import { CategoryModule } from '../category/module';
import { KeywordModule } from '../keyword/module';

@Global()
@Module({
  controllers: [SearchController],
  imports: [forwardRef(() => KeywordModule), forwardRef(() => ProductsModule), forwardRef(() => CategoryModule)],
  providers: [SearchService],
})
export class SearchModule {}
