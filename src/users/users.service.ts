import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/common/httpStatus';
import { User, UserDocument } from './users.model';
import { CreateUserInput, UpdateUserInput } from './users.type';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  async create(input: CreateUserInput) {
    const model = new this.userModel({
      ...input,
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

  async findOne(slugOrId: string) {
    let model = null
    if (isValidObjectId(slugOrId)){
      model = await this.userModel.findById(slugOrId)
    } else {
      model = await this.userModel.findOne({ slug: slugOrId })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('User not found')
    return model
  }


  async update(slugOrId: string, updateInput: UpdateUserInput) {
    let user = null
    if (isValidObjectId(slugOrId)){
      user = await this.userModel.findByIdAndUpdate(slugOrId, updateInput)
    } else {
      user = await this.userModel.findOneAndUpdate({ slug: slugOrId }, updateInput)
    }
    if (!user) throw HTTP_STATUS.NOT_FOUND('User not found')
    const updated = await this.findOne(user._id)
    return updated
  }

  async remove(slugOrId: string) {
    let res = null
    if (isValidObjectId(slugOrId)){
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
