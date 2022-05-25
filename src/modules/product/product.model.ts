import { Keyword } from './../keyword/model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type ProductDocument = Product & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  shortName: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  images: string[]
  
  @Prop({ required: false, default: '' })
  description?: string

  @Prop({ required: true, type: Types.ObjectId, ref: Org.name })
  orgId: string

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: Keyword.name }] })
  keywords: string[]

  @Prop({ type: Object, default: {} })
  others?: object
}

export const ProductSchema = SchemaFactory.createForClass(Product).index({ name: 'text', description: 'text' })
ProductSchema.plugin(MongooseDelete, { overrideMethods: 'all' })