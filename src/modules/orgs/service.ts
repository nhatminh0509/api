import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { generateSlugNonShortId } from 'src/core/common/function';
import { Org, OrgDocument } from './model';
import { CreateOrgInput, QueryListOrg, UpdateOrgInput } from './type';
import { SORT_DIRECTION } from 'src/core/common/constants';

@Injectable()
export class OrgsService {
  constructor(@InjectModel(Org.name) private orgModel: SoftDeleteModel<OrgDocument>) {
    this.orgModel.createIndexes()
  }

  async create(input: CreateOrgInput) {
    const org = new this.orgModel({
      ...input,
      slug: generateSlugNonShortId(input.name)
    })
    const orgCreated = await org.save()
    return orgCreated
  }

  async findAll(query: QueryListOrg) {
    const { domain, owner, searchText, skip = 0, limit = 20, orderBy = 'createdAt', direction = SORT_DIRECTION.DESC } = query
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

    if (owner) {
      condition = {
        ...condition,
        owner
      }
    }
    
    if (domain) {
      condition = {
        ...condition,
        domain
      }
    }

    data = await this.orgModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.orgModel.countDocuments(condition)
    
    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }
  
  async findOneByDomain(domain: string) {
    console.log(domain)
    const org = await this.orgModel.findOne({ domain }).lean()
    if (!org) throw HTTP_STATUS.NOT_FOUND('Domain not found')
    return org
  }

  async findOne(slugOrId: string) {
    let org = null
    if (isValidObjectId(slugOrId)){
      org = await this.orgModel.findById(slugOrId).lean()
    } else {
      org = await this.orgModel.findOne({ slug: slugOrId }).lean()
      // org = await this.orgModel.findOne({ slug: slugOrId }).populate({
      //   path: 'owner',
      //   match: { _id: { $ne: null }}
      // }).lean()
    }
    if (!org) throw HTTP_STATUS.NOT_FOUND('Org not found')
    return org
  }


  async update(slugOrId: string, updateInput: UpdateOrgInput) {
    let org = null
    let updateData = { ...updateInput } as any
    if (updateData.name) {
      updateData.slug = generateSlugNonShortId(updateData.name)
    }
    if (isValidObjectId(slugOrId)){
      org = await this.orgModel.findByIdAndUpdate(slugOrId, updateData)
    } else {
      org = await this.orgModel.findOneAndUpdate({ slug: slugOrId }, updateData)
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
