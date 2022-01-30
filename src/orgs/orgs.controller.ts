import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { OrgsService } from './orgs.service';
import { CreateOrgInput, UpdateOrgInput } from './orgs.type';

@ApiTags('Orgs')
@Controller('orgs')
export class OrgsController {
  constructor(private readonly orgsService: OrgsService) {}

  @Post()
  create(@Body() body: CreateOrgInput) {
    return this.orgsService.create(body);
  }

  @Get()
  findAll() {
    return this.orgsService.findAll();
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
  update(@Param('slugOrId') slugOrId: string, @Body() updateInput: UpdateOrgInput) {
    return this.orgsService.update(slugOrId, updateInput)
  }

  @Delete(':slugOrId')
  remove(@Param('slugOrId') slugOrId: string) {
    return this.orgsService.remove(slugOrId);
  }
}
