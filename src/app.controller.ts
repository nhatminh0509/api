import { Controller, Get, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AppService } from './app.service'
import { CurrentOrg, CurrentUser } from './common/decorator'

@ApiTags('HOME')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello', parameters: [{
    name: 'string',
    in: 'query'
  }] })
  getHello(@Req() request: Request, @CurrentOrg() currentOrg: string) {
    console.log(currentOrg)
    return this.appService.getHello()
  }
}
