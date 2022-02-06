import { Controller, Get, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AppService } from './app.service'
import { CurrentOrgDomain, CurrentUser } from './auth/auth.decorator'
import config from './common/config'

@ApiTags('HOME')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello', parameters: [{
    name: 'string',
    in: 'query'
  }] })
  getHello(@Req() request: Request, @CurrentOrgDomain() currentOrgDomain: string) {
    console.log(currentOrgDomain)
    return {
      currentOrgDomain,
      test: config.test
    }
  }
}
