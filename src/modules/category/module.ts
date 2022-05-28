import { Keyword } from './../keyword/model';
import { Global, Module, forwardRef } from '@nestjs/common';
import { CategoryService } from './service';
import { CategoryController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './model';
import { RelationshipCategoryBrandModule } from '../relationship-category-brand/module';

@Global()
@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]), forwardRef(() => RelationshipCategoryBrandModule), forwardRef(() => Keyword)],
  exports: [CategoryService]
})
export class CategoryModule {}
