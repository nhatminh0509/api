import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { TransactionLog, TransactionLogDocument } from './model';
import { CreateTransactionLogInput } from './type';
import mongoError from 'src/core/common/mongoError';

@Injectable()
export class TransactionLogService {
  constructor(
    @InjectModel(TransactionLog.name) private transactionLogModel: SoftDeleteModel<TransactionLogDocument>,
  ) {
    this.transactionLogModel.createIndexes()
  }

  async create(input: CreateTransactionLogInput) {
    try {
      const model = new this.transactionLogModel({ ...input })
      const modelCreated = await model.save()
      return modelCreated
    } catch (err) {
      throw HTTP_STATUS.BAD_REQUEST(mongoError(err))
    }
  }
}
