import { Global, Module } from '@nestjs/common';
import { RelationshipCategoryBrandService } from './service';
import { MongooseModule } from '@nestjs/mongoose';
import { RelationshipCategoryBrand, RelationshipCategoryBrandSchema } from './model';
import { RelationshipCategoryBrandController } from './controller';

@Global()
@Module({
  controllers: [RelationshipCategoryBrandController],
  providers: [RelationshipCategoryBrandService],
  imports: [MongooseModule.forFeature([{ name: RelationshipCategoryBrand.name, schema: RelationshipCategoryBrandSchema }])],
  exports: [RelationshipCategoryBrandService]
})
export class RelationshipCategoryBrandModule {}
