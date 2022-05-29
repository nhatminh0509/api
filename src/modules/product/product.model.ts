import { Keyword } from './../keyword/model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'
import { Brand } from '../brand/model';
import { Category } from '../category/model';
import { Type } from 'class-transformer';

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

  @Prop({ required: true, type: String, ref: Brand.name })
  @Type(() => Brand)
  brandSlug: Brand

  @Prop({ required: true, type: String, ref: Category.name })
  @Type(() => Category)
  categorySlug: Category

  @Prop({ required: true, type: String, ref: Org.name })
  @Type(() => Org)
  orgSlug: Org

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: Keyword.name }] })
  keywords: Keyword[]

  @Prop({ type: Object, default: {} })
  others?: object
}

export const ProductSchema = SchemaFactory.createForClass(Product).index({ name: 'text', shortName: 'text', description: 'text' })
ProductSchema.plugin(MongooseDelete, { overrideMethods: 'all' })