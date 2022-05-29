import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { SORT_DIRECTION } from 'src/core/common/constants';
import { RelationshipCategoryBrand, RelationshipCategoryBrandDocument } from './model';
import { UpdateCategoryRelationshipCategoryBrandInput, QueryListRelationshipCategoryBrand, UpdateBrandRelationshipCategoryBrandInput } from './type';

@Injectable()
export class RelationshipCategoryBrandService {
  constructor(@InjectModel(RelationshipCategoryBrand.name) private relationshipModel: SoftDeleteModel<RelationshipCategoryBrandDocument>) {
    this.relationshipModel.createIndexes()
  }

  async updateCategory({ brandIds, categoryId }: UpdateCategoryRelationshipCategoryBrandInput) {
    const allBrand = (await this.relationshipModel.find({
      categoryId: new Types.ObjectId(categoryId)
    })).map(item => {
      return item.brandId?.toString()
    })
    const deleteBrand = allBrand.filter(item => !brandIds.includes(item))
    const insertBrand = brandIds.filter(item => !allBrand.includes(item))
    const dataInsert = insertBrand.map(brandId => {
      return {
        categoryId: new Types.ObjectId(categoryId),
        brandId: new Types.ObjectId(brandId)
      }
    })
    await this.relationshipModel.deleteMany({
      categoryId: new Types.ObjectId(categoryId),
      brandSlug: {
        $in: deleteBrand.map(brandId => new Types.ObjectId(brandId))
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }
  
  async updateBrand({ brandId, categoryIds }: UpdateBrandRelationshipCategoryBrandInput) {
    const allCategory = (await this.relationshipModel.find({
      brandId: new Types.ObjectId(brandId)
    })).map(item => {
      return item.categoryId?.toString()
    })
    const deleteCategory = allCategory.filter(item => !categoryIds.includes(item))
    const insertCategory = categoryIds.filter(item => !allCategory.includes(item))
    const dataInsert = insertCategory.map(categoryId => {
      return {
        brandId: new Types.ObjectId(brandId),
        categoryId: new Types.ObjectId(categoryId)
      }
    })
    await this.relationshipModel.deleteMany({
      brandId: new Types.ObjectId(brandId),
      category: {
        $in: deleteCategory.map(categoryId => new Types.ObjectId(categoryId))
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }

  async findAll(query: QueryListRelationshipCategoryBrand) {
    const { brandId, categoryId, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {} as any
    if (brandId) {
      condition.brandId = new Types.ObjectId(brandId)
    }

    if (categoryId) {
      condition.categoryId = new Types.ObjectId(categoryId)
    }

    data = await this.relationshipModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.relationshipModel.countDocuments(condition)

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
