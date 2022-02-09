import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import HTTP_STATUS from 'src/common/httpStatus';
import { UsersService } from 'src/users/users.service';
import { SignInInput } from './auth.type';
import Permissions from './permissions';
import { Role, RoleDocument } from './roles.model';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import config from 'src/common/config';
import { OrgsService } from 'src/orgs/orgs.service';

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

    const org = await this.orgService.findOneByDomain('http://localhost:5500')

    let role = null
    if (org && user.roles) {
      role = user.roles[org._id]
      delete user.roles
      user.role = role
    }

    const userData = {
      _id: user?._id,
      status: user?.status,
      phone: user?.phone,
      email: user?.email,
      avatar: user?.avatar,
      username: user?.username,
      role: role
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

  async getPermissions () {
    return Object.keys(Permissions)
  }

  async userHasPermissions (id, domain, permissions) {
    const res = await this.orgService.findOneByDomain(domain)
    console.log(res)
  }
}
