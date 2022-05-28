import { generateSlugNonShortId } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { RelationshipCategoryBrandService } from '../relationship-category-brand/service';
import { Brand, BrandDocument } from './model';
import { CreateBrandInput, QueryListBrand, UpdateBrandInput } from './type';
import mongoError from 'src/core/common/mongoError';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: SoftDeleteModel<BrandDocument>,
    @Inject(forwardRef(() => RelationshipCategoryBrandService)) private readonly relationshipCategoryBrandService : RelationshipCategoryBrandService
  ) {
    this.brandModel.createIndexes()
  }

  async create(input: CreateBrandInput) {
    try {
      const model = new this.brandModel({
        name: input.name,
        image: input.image,
        description: input.description,
        others: input.others,
        orgId: new Types.ObjectId(input.orgId),
        shortName: input.shortName,
        slug: generateSlugNonShortId(input.name)
      })
      const modelCreated = await model.save()
      if (modelCreated && input.categoryIds.length > 0) {
        await this.relationshipCategoryBrandService.updateBrand({
          brandId: modelCreated._id,
          categoryIds: input.categoryIds
        })
      }
      return modelCreated
    } catch (err) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(err))
    }
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
      model = await this.brandModel.findById(field).populate('products')
    } else {
      model = await this.brandModel.findOne({ slug: field }).populate('products')
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Brand not found')
    return model
  }


  async update(field: string, input: UpdateBrandInput) {
    try {
      let model = null
      let categoryIds = input.categoryIds
      delete input.categoryIds
      let updateInput = { ...input } as any
      if (updateInput.name) {
        updateInput.slug = generateSlugNonShortId(updateInput.name)
      }
      if (checkObjectId(field)){
        model = await this.brandModel.findByIdAndUpdate(field, updateInput)
      } else {
        model = await this.brandModel.findOneAndUpdate({ slug: field }, updateInput)
      }
      if (!model) throw HTTP_STATUS.NOT_FOUND('Brand not found')
      if (categoryIds) {
        await this.relationshipCategoryBrandService.updateBrand({
          brandId: model._id,
          categoryIds
        })
      }
      const updated = await this.findOne(model._id)
      return updated
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }

  async remove(slugOrId: string) {
    try {
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
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }
}
