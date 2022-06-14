import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type SettingDocument = Setting & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true, toJSON: {
  virtuals: true
}})
export class Setting {
  @Prop({ required: true, unique: true, index: true })
  key: string

  @Prop({ type: Object, default: {} })
  value: object
}

export const SettingSchema = SchemaFactory.createForClass(Setting)
SettingSchema.plugin(MongooseDelete, { overrideMethods: 'all' })
