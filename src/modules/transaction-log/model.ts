import { Network } from './../network/model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export type TransactionLogDocument = TransactionLog & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true, toJSON: {
  virtuals: true
}})
export class TransactionLog {
  @Prop({ required: true, unique: true, index: true })
  hash: string

  @Prop({ required: true, type: Types.ObjectId, ref: Network.name })
  @Type(() => Network)
  networkId: Network

  @Prop({ required: true, index: true })
  functionName: string

  @Prop({ type: Object, default: {} })
  data: object
}

export const TransactionLogSchema = SchemaFactory.createForClass(TransactionLog)
TransactionLogSchema.plugin(MongooseDelete, { overrideMethods: 'all' })
