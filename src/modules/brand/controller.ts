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
import { BrandsService } from './service';
import { CreateBrandInput, QueryListBrand, UpdateBrandInput } from './type';

@ApiTags('Brand')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseAuthGuard(Permissions.CREATE_BRAND)
  create(@Body() body: CreateBrandInput) {
    return this.brandsService.create(body);
  }
  
  @Get()
  findAll(@Query() query: QueryListBrand) {
    return this.brandsService.findAll(query);
  }
  
  @Get(':field')
  findOne(@Param('field') field: string) {
    return this.brandsService.findOne(field);
  }
  
  @Put(':field')
  @UseAuthGuard(Permissions.UPDATE_BRAND)
  update(@Param('field') slugOrId: string, @Body() updateInput: UpdateBrandInput) {
    return this.brandsService.update(slugOrId, updateInput)
  }
  
  @Delete(':field')
  @UseAuthGuard(Permissions.DELETE_BRAND)
  remove(@Param('field') id: string) {
    return this.brandsService.remove(id);
  }
}
