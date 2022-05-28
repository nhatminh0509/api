import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { User, UserDocument, UserStatus } from './model';
import { CreateUserInput, QueryListUser, UpdateUserInput } from './type';
import * as bcrypt from 'bcrypt'
import { SORT_DIRECTION } from 'src/core/common/constants';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {
    this.userModel.createIndexes()
  }

  async create(input: CreateUserInput) {
    const model = new this.userModel({
      ...input,
      password: bcrypt.hashSync(
        input.password || '@admin',
        10,
      ),
      status: UserStatus.Pending
    })
    const userCreated = await model.save()
    return userCreated
  }

  async findAll(query: QueryListUser) {
    const { searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
    let sort = {
      [orderBy]: direction === 'asc' ? 1 : -1
    }
    let data = []
    let total = 0
    let condition = {}

    if(searchText) { 
      condition = {
        ...condition,
        $text: { $search: searchText }
      }
    }

    data = await this.userModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.userModel.countDocuments(condition)

    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
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
