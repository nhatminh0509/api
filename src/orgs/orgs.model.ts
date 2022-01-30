import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'

export type OrgDocument = Org & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Org {
  @Prop({ required: true })
  name: string
  
  @Prop({ required: true, unique: true })
  domain: string
  
  @Prop({ required: true })
  owner: string

  @Prop({ default: [] })
  managers: string[]

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ type: Object })
  siteSetting: object
}

export const OrgSchema = SchemaFactory.createForClass(Org)
OrgSchema.plugin(MongooseDelete, { overrideMethods: 'all' })