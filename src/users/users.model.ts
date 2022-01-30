import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as MongooseDelete from 'mongoose-delete'

export type UserDocument = User & MongooseDelete.SoftDeleteDocument

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  displayName: string
  
  @Prop({ required: true })
  username: string
  
  @Prop({ required: true })
  email: string
  
  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(MongooseDelete, { overrideMethods: 'all' })