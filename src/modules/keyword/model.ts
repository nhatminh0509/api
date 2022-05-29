import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type KeywordDocument = Keyword & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Keyword {
  @Prop({ required: true })
  key: string
  
  @Prop({ required: true })
  subKey: string

  @Prop({ required: true, default: 0 })
  count: number

  @Prop({ required: true, type: Types.ObjectId, ref: Org.name })
  @Type(() => Org)
  orgId: Org
}

export const KeywordSchema = SchemaFactory.createForClass(Keyword).index({ key: 'text', subKey: 'text' })
KeywordSchema.plugin(MongooseDelete, { overrideMethods: 'all' })