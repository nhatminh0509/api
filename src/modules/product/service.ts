import { removeVietnameseTones, overrideMethodsAggregate, joinModel, select, searchTextWithRegexAggregate, filterAggregate, convertStringToObjectId } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
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
    const { categoryIds, brandIds ,searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let data2 = []
    let total = 0
    let condition = {}

    if(searchText) { 
      condition = {
        ...condition,
        $text: { $search: searchText }
      }
    }
    console.log(categoryIds)
    // data = await this.productModel.find(condition).sort(sort).skip(skip).limit(limit).populate('keywords orgId categoryId brandId', 'key domain name count').lean()
    // data = await this.productModel.find(condition).sort(sort).skip(skip).limit(limit).lean()
    total = await this.productModel.countDocuments(condition)

    // const joinModel = { 
    //   $lookup: {
    //     from: 'keywords',
    //     foreignField: '_id',
    //     localField: 'keywords',
    //     as: 'keys'
    //   },
    // }

    let aggregate: any[] = [overrideMethodsAggregate()]
    // Join
    aggregate.push(joinModel('keywords', '_id', 'keywords', 'keys'))

    // Query
    if (searchText) {
      aggregate.push(searchTextWithRegexAggregate(searchText, ['name', 'shortName', 'description', 'keys.subKey', 'keys.key']))
    }
    
    if (categoryIds) {
      let filterValue = Array.isArray(categoryIds) ? categoryIds.map(id => convertStringToObjectId(id) ) : [convertStringToObjectId(categoryIds)]
      aggregate.push(filterAggregate('categoryId', filterValue))
    }

    if (brandIds) {
      let filterValue = Array.isArray(brandIds) ? brandIds.map(id => convertStringToObjectId(id) ) : [convertStringToObjectId(brandIds)]
      aggregate.push(filterAggregate('brandId', filterValue))
    }

    // Select
    aggregate.push(select(['name', 'description', 'image', 'slug', 'shortName','keys.key']))
    data = await this.productModel.aggregateWithDeleted(aggregate)

    return {
      // data,
      total,
      data,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
