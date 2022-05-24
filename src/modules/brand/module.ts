import { Global, Module } from '@nestjs/common';
import { BrandsService } from './service';
import { BrandsController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './model';

@Global()
@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])],
  exports: [BrandsService]
})
export class BrandsModule {}
