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
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { UsersService } from './service';
import { CreateUserInput, QueryListUser, UpdateUserInput, UpdateUserRoleInput } from './type';

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
  
  @Put('/update-roles/:id')
  @UseAuthGuard(Permissions.UPDATE_USER_ROLE)
  updateRole(@Param('id') slugOrId: string, @Body() updateInput: UpdateUserRoleInput) {
    return this.usersService.updateRole(slugOrId, updateInput)
  }
  
  @Delete(':id')
  @UseAuthGuard(Permissions.DELETE_USER)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
