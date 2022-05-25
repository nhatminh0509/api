import { Global, Module } from '@nestjs/common';
import { ProductsService } from './service';
import { ProductsController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';

@Global()
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
  exports: [ProductsService]
})
export class ProductsModule {}
