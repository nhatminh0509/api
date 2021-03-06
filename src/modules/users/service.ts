import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';
import { SoftDeleteModel } from 'mongoose-delete';
import { checkObjectId } from 'src/core/common/function';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { User, UserDocument, UserStatus } from './model';
import { CreateUserInput, QueryListUser, UpdateUserInput, UpdateUserRoleInput } from './type';
import * as bcrypt from 'bcrypt'
import { SORT_DIRECTION } from 'src/core/common/constants';
import { ethers } from 'ethers';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {
    this.userModel.createIndexes()
  }

  async create(input: CreateUserInput) {
    let newInput = {
      ...input, // TODO Pending status
      status: UserStatus.Active
    }
    if (input.password) {
      newInput.password = bcrypt.hashSync(
        input.password || '@admin',
        10,
      )
    }
    const model = new this.userModel(newInput)
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

  async findOneLocal(field: string) {
    let model = null
    if (checkObjectId(field)){
      model = await this.userModel.findById(field)
    } else if (isEmail(field)) {
      model = await this.userModel.findOne({ email: field })
    } else if (ethers.utils.isAddress(field)) {
      model = await this.userModel.findOne({ address: field })
    } else {
      model = await this.userModel.findOne({ username: field })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('User not found')
    return model
  }

  async clearMessageHash(address: string) {
    return await this.userModel.findOneAndUpdate({ address: { $regex: address, $options: 'i' } }, { messageHash: null, messageHashTime: null })
  }

  async findOne(field: string) {
    let model = null
    if (checkObjectId(field)){
      model = await this.userModel.findById(field)
    } else if (isEmail(field)) {
      model = await this.userModel.findOne({ email: { $regex: field, $options: 'i' } })
    } else if (ethers.utils.isAddress(field)) {
      model = await this.userModel.findOne({ address: { $regex: field, $options: 'i' } })
    } else {
      model = await this.userModel.findOne({ username: { $regex: field, $options: 'i' } })
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('User not found')
    return model
  }


  async getMessageHash(address: string) {
    if (!ethers.utils.isAddress(address)) {
      throw HTTP_STATUS.BAD_REQUEST('Address invalid')
    }
    const now = new Date()
    const message = `Ch??o ${address} ?????n h??? th???ng c???a ch??ng t??i, b???n h??y d??ng m?? n??y ????? k??, m?? c?? gi?? tr??? trong v??ng 24h k??? t??? ${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`
    let user = await this.userModel.findOne({ address: { $regex: address, $options: 'i' } })
    if (user) {
      const updated = await this.userModel.findOneAndUpdate({ address: { $regex: address, $options: 'i' } }, {
        messageHash: message,
        messageHashTime: now.getTime()
      })
      if (!updated) {
        throw HTTP_STATUS.NOT_FOUND('Can not get message')
      }
    } else {
      let newInput = {
        address,
        messageHash: message,
        messageHashTime: now.getTime(),
        // TOdo pending status
        status: UserStatus.Active
      }
      const model = new this.userModel(newInput)
      const userCreated = await model.save()
      if (!userCreated?._id) {
        throw HTTP_STATUS.NOT_FOUND('Can not get message')
      }
    }
    return {
      message
    }
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

  async updateRole(field: string, input: UpdateUserRoleInput) {
    let user = null
    let updateInput = { ...input }
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
