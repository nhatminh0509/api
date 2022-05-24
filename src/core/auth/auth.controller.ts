import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import Permissions from '../permissions'
import { CurrentOrgDomain, UseAuthGuard } from './auth.decorator'
import { AuthService } from './auth.service'
import { CreateRoleInput, QueryListRole, SignInInput, UpdateRoleInput } from './auth.type'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  signIn(@CurrentOrgDomain() domain, @Body() body: SignInInput) {
    return this.authService.signIn(domain, body)
  }
  
  @Get('/permissions')
  @UseAuthGuard(Permissions.LIST_PERMISSIONS)
  findAllPermissions() {
    return this.authService.getPermissions()
  }

  @Post('/create-roles')
  @UseAuthGuard(Permissions.CREATE_ROLE)
  createRole(@Body() body: CreateRoleInput) {
    return this.authService.createRoles(body)
  }

  @Get('/roles')
  @UseAuthGuard(Permissions.READ_ROLE)
  findAllRole(@Query() query: QueryListRole) {
    return this.authService.findAllRole(query)
  }
  
  @Get('/roles/:id')
  @UseAuthGuard(Permissions.READ_ROLE)
  findOneRole(@Param('id') id: string) {
    return this.authService.findOneRole(id)
  }
  
  @Put('/roles/:id')
  @UseAuthGuard(Permissions.UPDATE_ROLE)
  update(@Param('id') slugOrId: string, @Body() updateInput: UpdateRoleInput) {
    return this.authService.updateRole(slugOrId, updateInput)
  }

  @Delete('/roles/:id')
  @UseAuthGuard(Permissions.DELETE_ROLE)
  remove(@Param('id') id: string) {
    return this.authService.removeRole(id)
  }
}
