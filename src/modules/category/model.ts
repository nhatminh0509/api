import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type CategoryDocument = Category & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true, toJSON: {
  virtuals: true
} })
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
  @Type(() => Org)
  orgId: Org

  @Prop({ type: Object, default: {} })
  others?: object
}

export const CategorySchema = SchemaFactory.createForClass(Category).index({ name: 'text', description: 'text', shortName: 'text' })
CategorySchema.plugin(MongooseDelete, { overrideMethods: 'all' })
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categoryId',
  justOne: false
})