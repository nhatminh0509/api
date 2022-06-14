import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Type } from 'class-transformer'
import { Types } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Org } from '../orgs/model'

export type NetworkDocument = Network & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true, toJSON: {
  virtuals: true
}})
export class Network {
  @Prop({ required: true, index: true })
  name: string

  @Prop({ required: true, index: true, unique: true })
  slug: string

  @Prop({ required: true, unique: true, index: true })
  rpc: string
  
  @Prop({ required: true, unique: true, index: true })
  wss: string

  @Prop({ required: true, unique: true, index: true })
  chainId: string

  @Prop({ required: true, default: 0 })
  currentBlock: number

  @Prop({ required: true, type: Date, default: null })
  updateBlockAt: Date | null  
  
  @Prop({ required: true, default: false, type: Boolean })
  enable: boolean
}

export const NetworkSchema = SchemaFactory.createForClass(Network)
NetworkSchema.plugin(MongooseDelete, { overrideMethods: 'all' })
