import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { OrgsService } from './service';
import { CreateOrgInput, QueryListOrg, UpdateOrgInput } from './type';

@ApiTags('Orgs')
@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  // @UseAuthGuard(Permissions.CREATE_ORG)
  create(@Body() body: CreateOrgInput) {
    return this.orgsService.create(body);
  }
  
  @Get()
  @UseAuthGuard(Permissions.READ_ORG)
  findAll(@Query() query: QueryListOrg) {
    return this.orgsService.findAll(query);
  }
  
  @Get('/config')
  findOneByDomain(@Req() req: Request) {
    return this.orgsService.findOneByDomain(req.headers.origin);
  }
  
  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.orgsService.findOne(slugOrId);
  }
  
  @Put(':slugOrId')
  @UseAuthGuard(Permissions.UPDATE_ORG)
  update(@Param('slugOrId') slugOrId: string, @Body() updateInput: UpdateOrgInput) {
    return this.orgsService.update(slugOrId, updateInput)
  }
  
  @Delete(':slugOrId')
  @UseAuthGuard(Permissions.DELETE_ORG)
  remove(@Param('slugOrId') slugOrId: string) {
    return this.orgsService.remove(slugOrId);
  }
}
