import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'

export type UserDocument = User & MongooseDelete.SoftDeleteDocument

export enum UserStatus {
  Pending = 'Pending',
  Active = 'Active',
  Deactivated = 'Deactivated',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false, index: 'text' })
  displayName: string
  
  @Prop({ required: false, unique: true })
  address: string

  @Prop({ required: false, unique: true })
  username: string
  
  @Prop({ required: false })
  password: string

  @Prop({ required: false, default: '' })
  avatar: string
  
  @Prop({ required: false, unique: true })
  email: string
  
  @Prop({ required: false, unique: true })
  phone: string

  @Prop({ required: false, default: null })
  messageHash: string
  
  @Prop({ required: false, default: null })
  messageHashTime: string

  @Prop({ enum: UserStatus, type: String, default: UserStatus.Active, index: true })
  status: UserStatus

  // { domain: roleSlug }
  @Prop({ type: Object, default: {} })
  roles: object

  @Prop({ required: false, type: Date, default: null })
  lastActivityAt: Date | null
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(MongooseDelete, { overrideMethods: 'all' })