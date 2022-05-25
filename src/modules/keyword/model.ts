import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type KeywordDocument = Keyword & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Keyword {
  @Prop({ required: true })
  key: string

  @Prop({ required: true, type: Types.ObjectId, ref: Org.name })
  orgId: string
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword).index({ key: 'text' })
KeywordSchema.plugin(MongooseDelete, { overrideMethods: 'all' })