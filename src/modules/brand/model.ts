import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'

export type BrandDocument = Brand & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  image: string
  
  @Prop({ required: false, default: '' })
  description?: string

  @Prop({ type: Object, default: {} })
  others?: object
}

export const BrandSchema = SchemaFactory.createForClass(Brand).index({ name: 'text', description: 'text' })
BrandSchema.plugin(MongooseDelete, { overrideMethods: 'all' })