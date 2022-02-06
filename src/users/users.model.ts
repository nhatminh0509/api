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
  @Prop({ required: true })
  displayName: string
  
  @Prop({ required: true })
  username: string
  
  @Prop({ required: true })
  password: string

  @Prop({ required: false, default: '' })
  avatar: string
  
  @Prop({ required: true })
  email: string
  
  @Prop({ required: true })
  phone: string

  @Prop({ enum: UserStatus, type: String, default: UserStatus.Pending, index: true })
  status: UserStatus

  @Prop({ type: Object })
  roles: object

  @Prop({ required: false, type: Date, default: null })
  lastActivityAt: Date | null
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(MongooseDelete, { overrideMethods: 'all' })