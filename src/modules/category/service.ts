import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { RelationshipCategoryBrandService } from '../relationship-category-brand/service';
import { Category, CategoryDocument } from './model';
import { CreateCategoryInput, QueryListCategory, UpdateCategoryInput } from './type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: SoftDeleteModel<CategoryDocument>,
    @Inject(forwardRef(() => RelationshipCategoryBrandService)) private readonly relationshipCategoryBrandService: RelationshipCategoryBrandService,
  ) {
    this.categoryModel.createIndexes()
  }

  async create(input: CreateCategoryInput) {
    const model = new this.categoryModel({
      name: input.name,
      image: input.image,
      description: input.description,
      others: input.others,
      orgId: input.orgId,
      shortName: input.shortName,
      slug: generateSlug(input.name)
    })
    const modelCreated = await model.save()
    if (modelCreated) {
      await this.relationshipCategoryBrandService.updateCategory({
        categoryId: modelCreated._id?.toString(),
        brandIds: input.brandIds
      })
    }
    return modelCreated
  }

  async findAll(query: QueryListCategory) {
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

    data = await this.categoryModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.categoryModel.countDocuments(condition)

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
      model = await this.categoryModel.findById(field)
    } else {
      model = await this.categoryModel.findOne({ slug: field })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Category not found')
    return model
  }


  async update(field: string, input: UpdateCategoryInput) {
    let model = null
    let brandIds = input.brandIds
    delete input.brandIds   
    let updateInput = { ...input } as any
    if (updateInput.name) {
      updateInput.slug = generateSlug(updateInput.name)
    }
    if (checkObjectId(field)){
      model = await this.categoryModel.findByIdAndUpdate(field, updateInput)
    } else {
      model = await this.categoryModel.findOneAndUpdate({ slug: field }, updateInput)
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Category not found')
    if (brandIds) {
      await this.relationshipCategoryBrandService.updateCategory({
        categoryId: model._id?.toString(),
        brandIds
      })
    }
    const updated = await this.findOne(model._id)
    return updated
  }

  async remove(slugOrId: string) {
    let res = null
    if (checkObjectId(slugOrId)){
      res = await this.categoryModel.delete({
        id: slugOrId
      })
    } else {
      res = await this.categoryModel.delete({
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
