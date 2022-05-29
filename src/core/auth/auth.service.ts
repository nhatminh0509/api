import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/core/common/httpStatus';
import { UsersService } from 'src/modules/users/service';
import { CreateRoleInput, QueryListRole, SignInInput, UpdateRoleInput } from './auth.type';
import Permissions from '../permissions';
import { Role, RoleDocument } from './roles.model';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import config from 'src/core/common/config';
import { OrgsService } from 'src/modules/orgs/service';
import { checkObjectId } from '../common/function';
import { UserStatus } from 'src/modules/users/model';
import { Types } from 'mongoose';
import { SORT_DIRECTION } from '../common/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    
    @Inject(forwardRef(() => OrgsService))
    private readonly orgService: OrgsService
  ) {
    this.roleModel.createIndexes()
  }

  async signIn(domain, input: SignInInput) {
    const { userNameOrEmail, password } = input

    let user = await this.userService.findOne(userNameOrEmail)

    if (!user) {
      throw HTTP_STATUS.NOT_FOUND('User not found')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw HTTP_STATUS.NOT_FOUND('User name or password invalid')
    }

    if (user.status !== UserStatus.Active) {
      throw HTTP_STATUS.FORBIDDEN('User not active')
    }
    // TODO
    const org = await this.orgService.findOneByDomain('http://localhost:5500')

    let role = null
    if (org && user.roles) {
      role = await this.roleModel.findById(user.roles[org._id]).lean()
      delete user.roles
      user.permissions = role?.permissions || []
    }
    
    const userData = {
      _id: user?._id,
      status: user?.status,
      phone: user?.phone,
      email: user?.email,
      avatar: user?.avatar,
      username: user?.username,
      permissions: user?.permissions 
    }

    const token = await this.signAccountToken(userData)

    return { user: userData, token }
  }

  async signAccountToken(
    user: any,
  ): Promise<string> {
    if (!user._id) {
      throw HTTP_STATUS.NOT_FOUND('User id not found')
    }
    const authData = {
      userId: user._id
    }
    const token = jwt.sign(authData, config.JWT_SECRET)
    return token
  }

  async userHasPermissions (id, domain, permissions) {
    const user = await this.userService.findOne(id)
    const org = await this.orgService.findOneByDomain(domain)

    if (user && user.roles && org && org._id && user.roles[org._id]) {
      const role = await this.roleModel.findById(user.roles[org._id])
      if (role && role.permissions && Array.isArray(role.permissions)) {
        if(role.permissions.includes(permissions) || role.permissions.includes(Permissions.ALL)) {
          return true
        }
      }
    }
    return false
  }
  
  async getPermissions () {
    return Object.keys(Permissions)
  }

  async createRoles (input: CreateRoleInput) {
    const model = new this.roleModel({
      ...input,
    })
    const modelCreated = await model.save()
    return modelCreated
  }

  async findAllRole(query: QueryListRole) {
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

    data = await this.roleModel.find(condition).sort(sort).skip(skip).limit(limit)
    total = await this.roleModel.countDocuments(condition)
    
    return {
      data,
      total,
      skip: Number(skip),
      limit: Number(limit)
    }
  }

  async findOneRole(field: string) {
    let model = null
    if (checkObjectId(field)){
      model = await (await this.roleModel.findById(field))
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Role not found')
    return model
  }

  async updateRole(field: string, input: UpdateRoleInput) {
    let model = null
    let updateInput = { ...input }
    if (checkObjectId(field)){
      model = await this.roleModel.findByIdAndUpdate(field, updateInput)
    }
    if (!model) throw HTTP_STATUS.NOT_FOUND('Role not found')
    const updated = await this.findOneRole(model._id)
    return updated
  }

  async removeRole(field: string) {
    let res = null
    if (checkObjectId(field)){
      res = await this.roleModel.delete({
        id: field
      })
    } else {
      res = await this.roleModel.delete({
        slug: field
      })
    }
    if (res.modifiedCount === 0) {
      throw HTTP_STATUS.BAD_REQUEST('Delete failed')
    } else {
      return HTTP_STATUS.SUCCESS('Delete successfully')
    }
  }
}
