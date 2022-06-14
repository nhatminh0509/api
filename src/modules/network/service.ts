import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { Network, NetworkDocument } from './model';
import { CreateNetworkInput } from './type';
import mongoError from 'src/core/common/mongoError';
import { KeyObject } from 'crypto';

@Injectable()
export class NetworkService {
  constructor(
    @InjectModel(Network.name) private networkModel: SoftDeleteModel<NetworkDocument>,
  ) {
    this.networkModel.createIndexes()
  }

  async create(input: CreateNetworkInput) {
    try {
      const model = new this.networkModel({ ...input })
      const modelCreated = await model.save()
      return modelCreated
    } catch (err) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(err))
    }
  }

  async findAll() {
    return await this.networkModel.find()
  }

  async findOne(query){
    return await this.networkModel.findOne(query)
  }

  async update(query, update) {
    return await this.networkModel.findOneAndUpdate(query, update)
  }
}
