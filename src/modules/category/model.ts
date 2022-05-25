import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type CategoryDocument = Category & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  shortName: string

  @Prop({ required: true })
  image: string
  
  @Prop({ required: false, default: '' })
  description?: string

  @Prop({ required: true,  type: Types.ObjectId, ref: Org.name })
  orgId: string

  @Prop({ type: Object, default: {} })
  others?: object
}

export const CategorySchema = SchemaFactory.createForClass(Category).index({ name: 'text', description: 'text', shortName: 'text' })
CategorySchema.plugin(MongooseDelete, { overrideMethods: 'all' })