import mongoError from 'src/core/common/mongoError';
import { generateSlugNonShortId } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId, generateSlug } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { RelationshipCategoryBrandService } from '../relationship-category-brand/service';
import { Category, CategoryDocument } from './model';
import { CreateCategoryInput, QueryListCategory, UpdateCategoryInput } from './type';
import { KeywordService } from '../keyword/service';
import AggregateFind from 'src/core/aggregate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: SoftDeleteModel<CategoryDocument>,
    @Inject(forwardRef(() => RelationshipCategoryBrandService)) private readonly relationshipCategoryBrandService: RelationshipCategoryBrandService,
    @Inject(forwardRef(() => KeywordService)) private readonly keywordService: KeywordService,
  ) {
    this.categoryModel.createIndexes()
  }

  async create(input: CreateCategoryInput) {
    try {
      let parent = null
      if (input.parentSlug) {
        parent = await this.findOne(input.parentSlug)
      }
      const keywords = input.keywords
      delete input.keywords
      const resKeywords = await this.keywordService.newKeyword({
        orgId: input.orgId,
        keys: keywords
      })
      const model = new this.categoryModel({
        name: input.name,
        image: input.image,
        description: input.description,
        others: input.others,
        orgId: new Types.ObjectId(input.orgId),
        shortName: input.shortName,
        parentSlug: parent ? parent.slug : null,
        ancestorsSlug: parent ? [parent?.slug, ...parent?.ancestorsSlug] : [],
        keywords: resKeywords,
        slug: generateSlugNonShortId(input.name)
      })
      const modelCreated = await model.save()
      if (modelCreated && input.brandsSlug && input.brandsSlug.length > 0) {
        await this.relationshipCategoryBrandService.updateCategory({
          categorySlug: modelCreated.slug,
          brandsSlug: input.brandsSlug
        })
      }
      return modelCreated  
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }

  async findAll(query: QueryListCategory) {
    const { searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query

    const aggregate = new AggregateFind(this.categoryModel)

    aggregate.joinModel('keywords', '_id', 'keywords', 'keys')

    if (searchText) {
      aggregate.searchTextWithRegex(searchText, ['name', 'shortName', 'description', 'keys.subKey', 'keys.key'])
    }

    aggregate.sort(orderBy, direction)

    aggregate.select(['name', 'description', 'shortName', 'slug', 'keys.key', 'category.name'])

    aggregate.paginate(skip, limit)

    const { data, total } = await aggregate.exec()

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }

  async findOne(field: string) {
    try {
      let model = null
      if (checkObjectId(field)){
        model = await (await this.categoryModel.findById(field))
      } else {
        model = await (await this.categoryModel.findOne({ slug: field }))
      }
      if (!model) throw HTTP_STATUS.NOT_FOUND('Category not found')
      return model
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }


  async update(field: string, input: UpdateCategoryInput) {
    try {
      let model = null
      let brandsSlug = input.brandsSlug
      delete input.brandsSlug   
      let updateInput = { ...input } as any
      if (updateInput.name) {
        updateInput.slug = generateSlugNonShortId(updateInput.name)
      }
      if (checkObjectId(field)){
        model = await this.categoryModel.findByIdAndUpdate(field, updateInput)
      } else {
        model = await this.categoryModel.findOneAndUpdate({ slug: field }, updateInput)
      }
      if (!model) throw HTTP_STATUS.NOT_FOUND('Category not found')
      if (brandsSlug) {
        await this.relationshipCategoryBrandService.updateCategory({
          categorySlug: model?.slug,
          brandsSlug
        })
      }
      const updated = await this.categoryModel.findById(model._id)
      return updated
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }

  async remove(slugOrId: string) {
    try {
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
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }
}
