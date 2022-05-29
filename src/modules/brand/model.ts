import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type BrandDocument = Brand & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true, toJSON: {
  virtuals: true
}})
export class Brand {
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

  @Prop({ required: true,  type: String, ref: Org.name })
  @Type(() => Org)
  orgSlug: Org

  @Prop({ type: Object, default: {} })
  others?: object
}

export const BrandSchema = SchemaFactory.createForClass(Brand).index({ name: 'text', description: 'text', shortName: 'text' })
BrandSchema.plugin(MongooseDelete, { overrideMethods: 'all' })
BrandSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'brandId',
  justOne: false
})