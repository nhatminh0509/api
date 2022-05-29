import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'
import Permissions from '../permissions'
import { Org } from 'src/modules/orgs/model';
import { Type } from 'class-transformer';

export type RoleDocument = Role & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, index: 'text' })
  name: string
  
  @Prop({ default: [] })
  permissions: Permissions[]

  @Prop({ required: false, default: 0 })
  priority: number

  @Prop({ required: true,  type: String, ref: Org.name })
  @Type(() => Org)
  orgSlug: Org
}

export const RoleSchema = SchemaFactory.createForClass(Role).index({ name: 'text' })
RoleSchema.plugin(MongooseDelete, { overrideMethods: 'all' })