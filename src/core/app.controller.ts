import { Controller, Get, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AppService } from './app.service'
import { CurrentOrgDomain, CurrentUser, UseAuthGuard } from './auth/auth.decorator'
import Permissions from './permissions'
import config from './common/config'

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseAuthGuard(Permissions.CREATE_ROLE)
  getHello(@Req() request: Request, @CurrentOrgDomain() currentOrgDomain: string, @CurrentUser() user) {
    return {
      currentOrgDomain,
      user
    }
  }
}
