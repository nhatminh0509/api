import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Brand } from '../brand/model'
import { Category } from '../category/model'

export type RelationshipCategoryBrandDocument = RelationshipCategoryBrand & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class RelationshipCategoryBrand {
  @Prop({ required: true, index: true, type: String, ref: Category.name })
  categoryId: string
  
  @Prop({ required: true, index: true, type: String, ref: Brand.name })
  brandId: string
}

export const RelationshipCategoryBrandSchema = SchemaFactory.createForClass(RelationshipCategoryBrand)
RelationshipCategoryBrandSchema.plugin(MongooseDelete, { overrideMethods: 'all' })