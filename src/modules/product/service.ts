import { overrideMethodsAggregate, searchTextWithRegexAggregate, filterAggregate, sortAggregate, checkObjectId } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { generateSlug } from 'src/core/common/function';
import { KeywordService } from '../keyword/service';
import { Product, ProductDocument } from './product.model';
import { CreateProductInput, QueryListProduct } from './type';
import AggregateFind from 'src/core/aggregate';
import HTTP_STATUS from 'src/core/common/httpStatus';
import mongoError from 'src/core/common/mongoError';
import { SORT_DIRECTION } from 'src/core/common/constants';
import { QueryListByKeywords } from 'src/core/common/type';

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
      orgSlug: input.orgSlug,
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
    const { categories, brands ,searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query

    const aggregate = new AggregateFind(this.productModel)

    aggregate.joinModel('keywords', '_id', 'keywords', 'keys')

    aggregate.joinModel('categories', 'slug', 'categorySlug', 'category', true)

    if (searchText) {
      aggregate.searchTextWithRegex(searchText, ['name', 'shortName', 'description', 'keys.subKey', 'keys.key'])
    }

    if (categories) {
      aggregate.filter('categorySlug', categories)
    }

    if (brands) {
      aggregate.filter('brandSlug', brands)
    }

    aggregate.sort(orderBy, direction)

    aggregate.select(['name', 'description', 'shortName', 'slug', 'keys.key', 'category.name'])

    aggregate.paginate(skip, limit)

    const { data, total } = await aggregate.exec()

    return {
      total,
      data,
      skip: Number(skip),
      limit: Number(limit)
    }
  }

  async findByKeywords(query: QueryListByKeywords) {
    const { keywords, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    const aggregate = new AggregateFind(this.productModel)

    aggregate.filter('keywords', keywords, true)

    aggregate.sort(orderBy, direction)

    aggregate.paginate(skip, limit)

    const { data, total } = await aggregate.exec()

    return {
      total,
      data,
      skip: Number(skip),
      limit: Number(limit)
    }
  }

  async findOne(field: string) {
    try {
      let model = null
      if (checkObjectId(field)){
        model = await this.productModel.findById(field)
      } else {
        model = await this.productModel.findOne({ slug: field })
      }
      if (!model) throw HTTP_STATUS.NOT_FOUND('Product not found')
      return model
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))      
    }
  }
}
