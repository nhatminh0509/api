import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId } from 'src/common/function';
import HTTP_STATUS from 'src/common/httpStatus';
import { User, UserDocument } from './users.model';
import { CreateUserInput, UpdateUserInput } from './users.type';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  async create(input: CreateUserInput) {
    const model = new this.userModel({
      ...input,
      password: bcrypt.hashSync(
        input.password || '@admin',
        10,
      ),
    })
    const userCreated = await model.save()
    return userCreated
  }

  async findAll() {
    return {
      data: await this.userModel.find(),
      total: await this.userModel.countDocuments()
    }
  }

  async findOne(field: string) {
    let model = null
    if (checkObjectId(field)){
      model = await this.userModel.findById(field)
    } else if (isEmail(field)) {
      model = await this.userModel.findOne({ email: field })
    } else {
      model = await this.userModel.findOne({ username: field })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('User not found')
    return model
  }


  async update(field: string, input: UpdateUserInput) {
    let user = null
    let updateInput = { ...input }
    if (input.password) {
      updateInput.password = bcrypt.hashSync(
        input.password || '@admin',
        10,
      )
    }
    if (checkObjectId(field)){
      user = await this.userModel.findByIdAndUpdate(field, updateInput)
    } else if (isEmail(field)) {
      user = await this.userModel.findOneAndUpdate({ email: field }, updateInput)
    } else {
      user = await this.userModel.findOneAndUpdate({ username: field }, updateInput)
    }
    if (!user) throw HTTP_STATUS.NOT_FOUND('User not found')
    const updated = await this.findOne(user._id)
    return updated
  }

  async remove(slugOrId: string) {
    let res = null
    if (checkObjectId(slugOrId)){
      res = await this.userModel.delete({
        id: slugOrId
      })
    } else {
      res = await this.userModel.delete({
        slug: slugOrId
      })
    }
    if (res.modifiedCount === 0) {
      throw HTTP_STATUS.BAD_REQUEST('Delete failed')
    } else {
      return HTTP_STATUS.SUCCESS('Delete successfully')
    }
  }
}
