import mongoError from 'src/core/common/mongoError';
import { generateSlugNonShortId, generateSlugUnique } from './../../core/common/function';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { RelationshipCategoryBrandService } from '../relationship-category-brand/service';
import { Category, CategoryDocument } from './model';
import { CreateCategoryInput, QueryListCategory, UpdateCategoryInput } from './type';
import { KeywordService } from '../keyword/service';
import AggregateFind from 'src/core/aggregate';
import { SORT_DIRECTION } from 'src/core/common/constants';
import { QueryListByKeywords } from 'src/core/common/type';

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
      const slug = await generateSlugUnique(this.categoryModel, input.name)
      const keywords = input.keywords
      let resKeywords = []
      delete input.keywords
      if (keywords && keywords?.length > 0) {
        resKeywords = await this.keywordService.newKeyword({
          orgSlug: input.orgSlug,
          keys: keywords
        })
      }
      const model = new this.categoryModel({
        name: input.name,
        image: input.image,
        description: input.description,
        others: input.others,
        orgSlug: input.orgSlug,
        shortName: input.shortName,
        parentSlug: parent ? parent.slug : null,
        ancestorsSlug: parent ? [parent?.slug, ...parent?.ancestorsSlug] : [],
        keywords: resKeywords,
        slug
      })
      const modelCreated = await model.save()
      if (modelCreated && input.brandIds && input.brandIds.length > 0) {
        await this.relationshipCategoryBrandService.updateCategory({
          categoryId: modelCreated._id,
          brandIds: input.brandIds
        })
      }
      return modelCreated  
    } catch (error) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(error))
    }
  }

  async findAll(query: QueryListCategory) {
    const { searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query

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


  async findByKeywords(query: QueryListByKeywords) {
    const { keywords, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    const aggregate = new AggregateFind(this.categoryModel)

    aggregate.filter('keywords', keywords, true)

    aggregate.sort(orderBy, direction)

    aggregate.paginate(skip, limit)

    const { data, total } = await aggregate.exec()

    return {
      total,
      data,
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
      let model = await this.findOne(field)
      if (!model) throw HTTP_STATUS.NOT_FOUND('Category not found')
      let brandIds = input.brandIds
      delete input.brandIds   
      let updateInput = { ...input } as any
      if (updateInput.name) {
        const slug = await generateSlugUnique(this.categoryModel, updateInput.name, model?.slug)
        updateInput.slug = slug
      }
      model = await this.categoryModel.findByIdAndUpdate(model._id, updateInput)
      if (brandIds) {
        await this.relationshipCategoryBrandService.updateCategory({
          categoryId: model?._id,
          brandIds
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
