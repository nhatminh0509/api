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
import { User } from 'src/users/users.model';
import config from 'src/common/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,

    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {
    this.roleModel.createIndexes()
  }

  async signIn(input: SignInInput) {
    const { userNameOrEmail, password } = input

    const user = await this.userService.findOne(userNameOrEmail)


    if (!user) {
      throw HTTP_STATUS.NOT_FOUND('User not found')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw HTTP_STATUS.NOT_FOUND('User name or password invalid')
    }

    const token = await this.signAccountToken(user)

    return { user, token }
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
}
