import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/common/httpStatus';
import { generateSlug } from 'src/common/function';
import { User, UserDocument } from './users.model';
import { CreateOrgInput, UpdateOrgInput } from './users.type';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}

  async create(input: CreateOrgInput) {
    const org = new this.userModel({
      ...input,
      slug: generateSlug(input.name)
    })
    const orgCreated = await org.save()
    return orgCreated
  }

  async findAll() {
    return {
      data: await this.userModel.find(),
      total: await this.userModel.countDocuments()
    }
  }
  
  async findOneByDomain(domain: string) {
    const org = await this.userModel.findOne({ domain })
    if (!org) throw HTTP_STATUS.NOT_FOUND('Domain not found')
    return org
  }

  async findOne(slugOrId: string) {
    let org = null
    if (isValidObjectId(slugOrId)){
      org = await this.userModel.findById(slugOrId)
    } else {
      org = await this.userModel.findOne({ slug: slugOrId })
    }
    if (!org) throw HTTP_STATUS.NOT_FOUND('Org not found')
    return org
  }


  async update(slugOrId: string, updateInput: UpdateOrgInput) {
    let org = null
    if (isValidObjectId(slugOrId)){
      org = await this.userModel.findByIdAndUpdate(slugOrId, updateInput)
    } else {
      org = await this.userModel.findOneAndUpdate({ slug: slugOrId }, updateInput)
    }
    if (!org) throw HTTP_STATUS.NOT_FOUND('Org not found')
    const updated = await this.findOne(org._id)
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
