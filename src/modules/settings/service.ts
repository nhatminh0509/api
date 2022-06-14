import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { Setting, SettingDocument } from './model';
import { CreateSettingInput } from './type';
import mongoError from 'src/core/common/mongoError';
import { KeyObject } from 'crypto';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(Setting.name) private settingModel: SoftDeleteModel<SettingDocument>,
  ) {
    this.settingModel.createIndexes()
  }

  async create(input: CreateSettingInput) {
    try {
      const model = new this.settingModel({ ...input })
      const modelCreated = await model.save()
      return modelCreated
    } catch (err) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(err))
    }
  }

  async findOne(key: string) {
    const data = await this.settingModel.findOne({ key })
    if (!data) {
      throw HTTP_STATUS.NOT_FOUND('Key not found')
    }
    return data
  }

  async update(key: string, value: object) {
    const updated = await this.settingModel.findOneAndUpdate({ key }, { value })
    if (!updated) {
      throw HTTP_STATUS.NOT_FOUND('Key not found')
    }
    return updated
  }
}
