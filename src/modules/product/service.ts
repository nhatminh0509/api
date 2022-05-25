import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { Product, ProductDocument } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>,
    // @Inject(forwardRef(() => RelationshipCategoryBrandService)) private readonly relationshipCategoryBrandService : RelationshipCategoryBrandService
  ) {
    this.productModel.createIndexes()
  }
}
