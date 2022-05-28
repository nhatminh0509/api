import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { RelationshipCategoryBrand, RelationshipCategoryBrandDocument } from './model';
import { UpdateCategoryRelationshipCategoryBrandInput, QueryListRelationshipCategoryBrand, UpdateBrandRelationshipCategoryBrandInput } from './type';

@Injectable()
export class RelationshipCategoryBrandService {
  constructor(@InjectModel(RelationshipCategoryBrand.name) private relationshipModel: SoftDeleteModel<RelationshipCategoryBrandDocument>) {
    this.relationshipModel.createIndexes()
  }

  async updateCategory({ brandIds, categoryId }: UpdateCategoryRelationshipCategoryBrandInput) {
    const allBrandId = (await this.relationshipModel.find({
      categoryId
    })).map(item => {
      return item.brandId
    })
    const deleteBrandId = allBrandId.filter(item => !brandIds.includes(item))
    const insertBrandId = brandIds.filter(item => !allBrandId.includes(item))
    const dataInsert = insertBrandId.map(brandId => {
      return {
        categoryId: new Types.ObjectId(categoryId),
        brandId: new Types.ObjectId(brandId)
      }
    })
    await this.relationshipModel.deleteMany({
      categoryId,
      brandId: {
        $in: deleteBrandId
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }
  
  async updateBrand({ brandId, categoryIds }: UpdateBrandRelationshipCategoryBrandInput) {
    const allCategoryId = (await this.relationshipModel.find({
      brandId
    })).map(item => {
      return item.categoryId.toString()
    })
    const deleteCategoryId = allCategoryId.filter(item => !categoryIds.includes(item))
    const insertCategoryId = categoryIds.filter(item => !allCategoryId.includes(item))
    const dataInsert = insertCategoryId.map(categoryId => {
      return {
        brandId: new Types.ObjectId(brandId),
        categoryId: new Types.ObjectId(categoryId)
      }
    })
    await this.relationshipModel.deleteMany({
      brandId,
      categoryId: {
        $in: deleteCategoryId
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }

  async findAll(query: QueryListRelationshipCategoryBrand) {
    const { brandId, categoryId, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {} as any
    if (brandId) {
      condition.brandId = brandId
    }

    if (categoryId) {
      condition.categoryId= categoryId
    }

    data = await this.relationshipModel.find(condition).sort(sort).skip(skip).limit(limit).populate('categoryId brandId')
    total = await this.relationshipModel.countDocuments(condition)

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
