import { Keyword } from '../keyword/model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'
import { Brand } from '../brand/model';
import { Category } from '../category/model';
import { Type } from 'class-transformer';

export type ProductAttributeDocument = ProductAttribute & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class ProductAttribute {
  @Prop({ required: true })
  name: string
  
  @Prop({ required: true, unique: true })
  slug: string
}

export const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute).index({ name: 'text' })
ProductAttributeSchema.plugin(MongooseDelete, { overrideMethods: 'all' })