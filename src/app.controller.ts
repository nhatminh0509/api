import { Controller, Get, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AppService } from './app.service'
import { CurrentOrgDomain, CurrentUser, UseAuthGuard } from './auth/auth.decorator'
import Permissions from './auth/permissions'
import config from './common/config'

@ApiTags('HOME')
@Controller()
@ApiBearerAuth('JWT') 
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseAuthGuard(Permissions.Hr_Access)
  getHello(@Req() request: Request, @CurrentOrgDomain() currentOrgDomain: string, @CurrentUser() user) {
    return {
      currentOrgDomain,
      user
    }
  }
}
