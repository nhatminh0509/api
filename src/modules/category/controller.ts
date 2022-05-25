import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { CategoryService } from './service';
import { CreateCategoryInput, QueryListCategory, UpdateCategoryInput } from './type';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseAuthGuard(Permissions.CREATE_CATEGORY)
  create(@Body() body: CreateCategoryInput) {
    return this.categoryService.create(body);
  }
  
  @Get()
  findAll(@Query() query: QueryListCategory) {
    return this.categoryService.findAll(query);
  }
  
  @Get(':field')
  findOne(@Param('field') field: string) {
    return this.categoryService.findOne(field);
  }
  
  @Put(':field')
  @UseAuthGuard(Permissions.UPDATE_CATEGORY)
  update(@Param('field') slugOrId: string, @Body() updateInput: UpdateCategoryInput) {
    return this.categoryService.update(slugOrId, updateInput)
  }
  
  @Delete(':field')
  @UseAuthGuard(Permissions.DELETE_CATEGORY)
  remove(@Param('field') id: string) {
    return this.categoryService.remove(id);
  }
}
