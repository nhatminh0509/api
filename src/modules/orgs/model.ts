import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { mongoose } from '@typegoose/typegoose'
import * as MongooseDelete from 'mongoose-delete'
import { User } from '../users/model'

export type OrgDocument = Org & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Org {
  @Prop({ required: true, index: 'text' })
  name: string
  
  @Prop({ required: true, unique: true })
  domain: string
  
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  owner: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ type: Object })
  siteSetting: object
}

export const OrgSchema = SchemaFactory.createForClass(Org).index({ name: 'text' })
OrgSchema.plugin(MongooseDelete, { overrideMethods: 'all' })