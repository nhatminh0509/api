import { Keyword, KeywordDocument } from './model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { NewKeyword, QueryListKeyword } from './type';

@Injectable()
export class KeywordService {
  constructor(@InjectModel(Keyword.name) private keywordModel: SoftDeleteModel<KeywordDocument>) {
    this.keywordModel.createIndexes()
  }

  async newKeyword(input: NewKeyword) {
    const keywordExisted = await this.keywordModel.find({
      orgId: input.orgId,
      key: {
        $in: input.keys
      }
    }).select('key').lean()
    const keysExisted = keywordExisted.map(item => item.key)
    let keyInsert = input.keys.filter(item => !keysExisted.includes(item))
    const dataInsert = keyInsert.map(key => {
      return { orgId: input.orgId, key }
    })
    const keysCreated = await this.keywordModel.insertMany(dataInsert)
    const result = [...keysCreated.map(item => item._id), ...keywordExisted.map(item => item._id)].map(item => item?.toString())
    return result
  }

  async findAll(query: QueryListKeyword) {
    const { searchText, orgId, skip = 0, limit = 20, orderBy = 'createdAt', direction = 'desc' } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {} as any
    
    if (searchText) {
      condition = {
        ...condition,
        $text: { $search: searchText }
      }
    }

    if (orgId) {
      condition.orgId = orgId
    }

    data = await this.keywordModel.find(condition).sort(sort).skip(skip).limit(limit).populate('categoryId brandId')
    total = await this.keywordModel.countDocuments(condition)

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
}
