import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { NetworkService } from './service';
import { CreateNetworkInput } from './type';

@ApiTags('Network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}


  @Get()
  findAll() {
    return this.networkService.findAll();
  }

  @Post()
  // @UseAuthGuard(Permissions.CREATE_SETTING)
  create(@Body() body: CreateNetworkInput) {
    return this.networkService.create({ ...body });
  }
}
