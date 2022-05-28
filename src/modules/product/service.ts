import { overrideMethodsAggregate, searchTextWithRegexAggregate, filterAggregate, sortAggregate } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { generateSlug } from 'src/core/common/function';
import { KeywordService } from '../keyword/service';
import { Product, ProductDocument } from './product.model';
import { CreateProductInput, QueryListProduct } from './type';
import AggregateFind from 'src/core/aggregate';

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
    const { categories, brands ,searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query

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
}
