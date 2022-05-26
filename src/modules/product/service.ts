import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { KeywordService } from '../keyword/service';
import { Product, ProductDocument } from './product.model';
import { CreateProductInput, QueryListProduct } from './type';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: SoftDeleteModel<ProductDocument>,
    @Inject(forwardRef(() => KeywordService)) private readonly keywordService: KeywordService
  ) {
    this.productModel.createIndexes()
  }

  async create (input: CreateProductInput) {
    const keywords = input.keywords
    delete input.keywords
    const resKeywords = await this.keywordService.newKeyword({
      orgId: input.orgId,
      keys: keywords
    })
    const product = new this.productModel({
      ...input,
      categoryId: new Types.ObjectId(input.categoryId),
      brandId: new Types.ObjectId(input.brandId),
      slug: generateSlug(input.name),
      keywords: resKeywords
    })
    const productCreated = await product.save()
    return productCreated
  }

  async findAll(query: QueryListProduct) {
    const { searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {}

    if(searchText) { 
      condition = {
        ...condition,
        $text: { $search: searchText }
      }
    }

    data = await this.productModel.find(condition).sort(sort).skip(skip).limit(limit).populate('keywords orgId categoryId brandId', 'key domain name').lean()
    total = await this.productModel.countDocuments(condition)
    
    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
