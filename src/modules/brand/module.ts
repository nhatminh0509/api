import { RelationshipCategoryBrandModule } from './../relationship-category-brand/module';
import { Global, Module, forwardRef } from '@nestjs/common';
import { BrandsService } from './service';
import { BrandsController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './model';

@Global()
@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]), forwardRef(() => RelationshipCategoryBrandModule)],
  exports: [BrandsService]
})
export class BrandsModule {}
