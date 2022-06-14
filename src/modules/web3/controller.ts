import {
  Body,
  Controller, Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Web3Service } from './service';
import { EnableWeb3Input, DisableWeb3Input } from './type';

@ApiTags('Web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Post('/enable')
  // @UseAuthGuard(Permissions.CREATE_SETTING)
  enable(@Body() body: EnableWeb3Input) {
    this.web3Service.startCheck(body)
    return { message: 'Success' }
  }
  
  @Post('/disable')
  // @UseAuthGuard(Permissions.CREATE_SETTING)
  disable(@Body() body: DisableWeb3Input) {
    this.web3Service.stopCheck(body)
    return { message: 'Success' }
  }
}
