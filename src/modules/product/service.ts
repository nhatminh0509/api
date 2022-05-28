import { removeVietnameseTones, overrideMethodsAggregate, joinModel, select, searchTextWithRegexAggregate, filterAggregate, convertStringToObjectId, checkObjectId, sortAggregate } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage, Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { generateSlug } from 'src/core/common/function';
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
    const { categories, brands ,searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query
    let data = []
    let total = 0
    let aggregate: PipelineStage[] = [overrideMethodsAggregate()]
    // Join
    // aggregate.push(joinModel('keywords', '_id', 'keywords', 'keys'))
    // aggregate.push(joinModel('categories', 'slug', 'categorySlug', 'category'))
    // aggregate.push({ $unwind: '$category' })

    // Query
    if (searchText) {
      aggregate.push(searchTextWithRegexAggregate(searchText, ['name', 'shortName', 'description', 'keys.subKey', 'keys.key']))
    }
    if (categories) {
      aggregate.push(filterAggregate('categorySlug', categories))
    }

    if (brands) {
      aggregate.push(filterAggregate('brandSlug', brands))
    }

    const aggregateCount = [...aggregate]
    aggregateCount.push({
      $count: 'total'
    })

    aggregate.push(sortAggregate(orderBy, direction))
    // Select
    aggregate.push(select(['name', 'description', 'image', 'slug', 'shortName']))
    aggregate.push({
      $skip: Number(skip)
    })
    aggregate.push({
      $limit: Number(limit)
    })
    data = await this.productModel.aggregateWithDeleted(aggregate)
    total = (await this.productModel.aggregateWithDeleted(aggregateCount))?.[0]?.total || 0

    return {
      total,
      data,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
