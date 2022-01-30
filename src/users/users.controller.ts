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
import { UsersService } from './users.service';
import { CreateOrgInput, UpdateOrgInput } from './users.type';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateOrgInput) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/config')
  findOneByDomain(@Req() req: Request) {
    return this.usersService.findOneByDomain(req.headers.origin);
  }

  @Get(':slugOrId')
  findOne(@Param('slugOrId') slugOrId: string) {
    return this.usersService.findOne(slugOrId);
  }

  @Put(':id')
  update(@Param('id') slugOrId: string, @Body() updateInput: UpdateOrgInput) {
    return this.usersService.update(slugOrId, updateInput)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
