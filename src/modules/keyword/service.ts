import { removeVietnameseTones } from './../../core/common/function';
import { Keyword, KeywordDocument } from './model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { NewKeyword, QueryListKeyword } from './type';
import { Types } from 'mongoose';
import { SORT_DIRECTION } from 'src/core/common/constants';

@Injectable()
export class KeywordService {
  constructor(@InjectModel(Keyword.name) private keywordModel: SoftDeleteModel<KeywordDocument>) {
    this.keywordModel.createIndexes()
  }

  async newKeyword(input: NewKeyword) {
    const keywordExisted = await this.keywordModel.find({
      orgId: new Types.ObjectId(input.orgId),
      key: {
        $in: input.keys
      }
    }).select('key').lean()
    const keysExisted = keywordExisted.map(item => item.key)
    let keyInsert = input.keys.filter(item => !keysExisted.includes(item))
    const dataInsert = keyInsert.map(key => {
      return { orgId: new Types.ObjectId(input.orgId), key, subKey: removeVietnameseTones(key), count: 0 }
    })
    const keysCreated = await this.keywordModel.insertMany(dataInsert)
    const result = [...keysCreated.map(item => item._id), ...keywordExisted.map(item => item._id)].map(item => item?.toString())
    return result
  }

  async findAll(query: QueryListKeyword) {
    const { searchText, orgId, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {} as any
    
    if (searchText) {
      condition = {
        ...condition,
        $text: { $search: removeVietnameseTones(searchText) }
      }
    }

    if (orgId) {
      condition.orgId = orgId
    }

    data = await this.keywordModel.find(condition).sort(sort).select('key')
    if (searchText) {
      const updateCountId = data.map(item => item._id)
      await this.keywordModel.updateMany({
        _id: {
          $in: updateCountId
        }
      }, {
        $inc: { count: 1 }
      })
    }

    return data
  }
}
