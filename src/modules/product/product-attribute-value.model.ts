import { ProductAttribute } from './product-attribute.model';
import { Keyword } from '../keyword/model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'
import { Brand } from '../brand/model';
import { Category } from '../category/model';
import { Type } from 'class-transformer';
import { Product } from './product.model';

export type ProductAttributeValueDocument = ProductAttributeValue & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class ProductAttributeValue {
  @Prop({ required: true, type: Types.ObjectId })
  @Type(() => ProductAttribute)
  attributeId: ProductAttribute
  
  @Prop({ required: true, type: Types.ObjectId })
  @Type(() => Product)
  productId: Product

  @Prop({ required: true, type: String })
  value: string
}

export const ProductAttributeValueSchema = SchemaFactory.createForClass(ProductAttributeValue)
ProductAttributeValueSchema.plugin(MongooseDelete, { overrideMethods: 'all' })