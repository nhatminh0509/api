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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { UsersService } from './users.service';
import { CreateUserInput, QueryListUser, UpdateUserInput } from './users.type';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseAuthGuard(Permissions.CREATE_USER)
  create(@Body() body: CreateUserInput) {
    return this.usersService.create(body);
  }
  
  @Get()
  @UseAuthGuard(Permissions.READ_USER)
  findAll(@Query() query: QueryListUser) {
    return this.usersService.findAll(query);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @Put(':id')
  @UseAuthGuard(Permissions.UPDATE_USER)
  update(@Param('id') slugOrId: string, @Body() updateInput: UpdateUserInput) {
    return this.usersService.update(slugOrId, updateInput)
  }
  
  @Delete(':id')
  @UseAuthGuard(Permissions.DELETE_USER)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
