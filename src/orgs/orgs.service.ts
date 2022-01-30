import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/common/httpStatus';
import { generateSlug } from 'src/common/function';
import { Org, OrgDocument } from './orgs.model';
import { CreateOrgInput, UpdateOrgInput } from './orgs.type';

@Injectable()
export class OrgsService {
  constructor(@InjectModel(Org.name) private orgModel: SoftDeleteModel<OrgDocument>) {}

  async create(input: CreateOrgInput) {
    const org = new this.orgModel({
      ...input,
      slug: generateSlug(input.name)
    })
    const orgCreated = await org.save()
    return orgCreated
  }

  async findAll() {
    return {
      data: await this.orgModel.find(),
      total: await this.orgModel.countDocuments()
    }
  }
  
  async findOneByDomain(domain: string) {
    const org = await this.orgModel.findOne({ domain })
    if (!org) throw HTTP_STATUS.NOT_FOUND('Domain not found')
    return org
  }

  async findOne(slugOrId: string) {
    let org = null
    if (isValidObjectId(slugOrId)){
      org = await this.orgModel.findById(slugOrId)
    } else {
      org = await this.orgModel.findOne({ slug: slugOrId })
    }
    if (!org) throw HTTP_STATUS.NOT_FOUND('Org not found')
    return org
  }


  async update(slugOrId: string, updateInput: UpdateOrgInput) {
    let org = null
    if (isValidObjectId(slugOrId)){
      org = await this.orgModel.findByIdAndUpdate(slugOrId, updateInput)
    } else {
      org = await this.orgModel.findOneAndUpdate({ slug: slugOrId }, updateInput)
    }
    if (!org) throw HTTP_STATUS.NOT_FOUND('Org not found')
    const updated = await this.findOne(org._id)
    return updated
  }

  async remove(slugOrId: string) {
    let res = null
    if (isValidObjectId(slugOrId)){
      res = await this.orgModel.delete({
        id: slugOrId
      })
    } else {
      res = await this.orgModel.delete({
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
