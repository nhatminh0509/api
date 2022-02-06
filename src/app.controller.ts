import { Controller, Get, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiHeader, ApiHeaders, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AppService } from './app.service'
import { CurrentOrgDomain, CurrentUser, UseAuthGuard } from './auth/auth.decorator'
import config from './common/config'

@ApiTags('HOME')
@Controller()
@ApiBearerAuth('JWT') 
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseAuthGuard()
  getHello(@Req() request: Request, @CurrentOrgDomain() currentOrgDomain: string, @CurrentUser() user) {
    console.log(user)
    return {
      currentOrgDomain
    }
  }
}
