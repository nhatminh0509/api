import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Keyword } from '../keyword/model'
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

  @Prop({ required: false, type: Types.ObjectId, ref: Category.name, default: null })
  @Type(() => Category)
  parentId?: Category

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: Category.name }], default: [] })
  ancestorIds: Category[]

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: Keyword.name }] })
  keywords: Keyword[]

  @Prop({ type: Object, default: {} })
  others?: object
}

export const CategorySchema = SchemaFactory.createForClass(Category).index({ name: 'text', description: 'text', shortName: 'text' })
CategorySchema.plugin(MongooseDelete, { overrideMethods: 'all' })
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: 'slug',
  foreignField: 'categorySlug',
  justOne: false
})
CategorySchema.virtual('ancestors', {
  ref: 'Category',
  localField: 'ancestorsSlug',
  foreignField: 'slug',
  justOne: false
})
CategorySchema.virtual('parent', {
  ref: 'Category',
  localField: 'parentSlug',
  foreignField: 'slug',
  justOne: true,
})