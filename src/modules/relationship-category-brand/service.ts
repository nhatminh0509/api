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

  async updateCategory({ brandsSlug, categorySlug }: UpdateCategoryRelationshipCategoryBrandInput) {
    const allBrand = (await this.relationshipModel.find({
      categorySlug
    })).map(item => {
      return item.brandSlug
    })
    const deleteBrand = allBrand.filter(item => !brandsSlug.includes(item))
    const insertBrand = brandsSlug.filter(item => !allBrand.includes(item))
    const dataInsert = insertBrand.map(brandSlug => {
      return {
        categorySlug,
        brandSlug
      }
    })
    await this.relationshipModel.deleteMany({
      categorySlug,
      brandSlug: {
        $in: deleteBrand
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }
  
  async updateBrand({ brandSlug, categoriesSlug }: UpdateBrandRelationshipCategoryBrandInput) {
    const allCategory = (await this.relationshipModel.find({
      brandSlug
    })).map(item => {
      return item.categorySlug
    })
    const deleteCategory = allCategory.filter(item => !categoriesSlug.includes(item))
    const insertCategory = categoriesSlug.filter(item => !allCategory.includes(item))
    const dataInsert = insertCategory.map(categorySlug => {
      return {
        brandSlug,
        categorySlug
      }
    })
    await this.relationshipModel.deleteMany({
      brandSlug,
      category: {
        $in: deleteCategory
      }
    })
    const insert = await this.relationshipModel.insertMany(dataInsert)
    return insert
  }

  async findAll(query: QueryListRelationshipCategoryBrand) {
    const { brandSlug, categorySlug, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {} as any
    if (brandSlug) {
      condition.brandSlug = brandSlug
    }

    if (categorySlug) {
      condition.categorySlug = categorySlug
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
