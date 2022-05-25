import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { RelationshipCategoryBrandService } from '../relationship-category-brand/service';
import { Brand, BrandDocument } from './model';
import { CreateBrandInput, QueryListBrand, UpdateBrandInput } from './type';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: SoftDeleteModel<BrandDocument>,
    @Inject(forwardRef(() => RelationshipCategoryBrandService)) private readonly relationshipCategoryBrandService : RelationshipCategoryBrandService
  ) {
    this.brandModel.createIndexes()
  }

  async create(input: CreateBrandInput) {
    const model = new this.brandModel({
      name: input.name,
      image: input.image,
      description: input.description,
      others: input.others,
      orgId: input.orgId,
      slug: generateSlug(input.name)
    })
    const modelCreated = await model.save()
    if (modelCreated) {
      await this.relationshipCategoryBrandService.updateBrand({
        brandId: modelCreated._id?.toString(),
        categoryIds: input.categoryIds
      })
    }
    return modelCreated
  }

  async findAll(query: QueryListBrand) {
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

    data = await this.brandModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.brandModel.countDocuments(condition)

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }

  async findOne(field: string) {
    let model = null
    if (checkObjectId(field)){
      model = await this.brandModel.findById(field)
    } else {
      model = await this.brandModel.findOne({ slug: field })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Brand not found')
    return model
  }


  async update(field: string, input: UpdateBrandInput) {
    let model = null
    let categoryIds = input.categoryIds
    delete input.categoryIds
    let updateInput = { ...input } as any
    if (updateInput.name) {
      updateInput.slug = generateSlug(updateInput.name)
    }
    if (checkObjectId(field)){
      model = await this.brandModel.findByIdAndUpdate(field, updateInput)
    } else {
      model = await this.brandModel.findOneAndUpdate({ slug: field }, updateInput)
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Brand not found')
    if (categoryIds) {
      await this.relationshipCategoryBrandService.updateBrand({
        brandId: model._id?.toString(),
        categoryIds
      })
    }
    const updated = await this.findOne(model._id)
    return updated
  }

  async remove(slugOrId: string) {
    let res = null
    if (checkObjectId(slugOrId)){
      res = await this.brandModel.delete({
        id: slugOrId
      })
    } else {
      res = await this.brandModel.delete({
        slug: slugOrId
      })
    }
    if (res.modifiedCount === 0) {
      throw HTTP_STATUS.BAD_REQUEST('Delete failed')
    } else {
      return HTTP_STATUS.SUCCESS('Delete successfully')
    }
  }
}
