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
  constructor(private readonly BrandsService: BrandsService) {}

  @Post()
  @UseAuthGuard(Permissions.CREATE_BRAND)
  create(@Body() body: CreateBrandInput) {
    return this.BrandsService.create(body);
  }
  
  @Get()
  findAll(@Query() query: QueryListBrand) {
    return this.BrandsService.findAll(query);
  }
  
  @Get(':field')
  findOne(@Param('field') field: string) {
    return this.BrandsService.findOne(field);
  }
  
  @Put(':field')
  @UseAuthGuard(Permissions.UPDATE_BRAND)
  update(@Param('field') slugOrId: string, @Body() updateInput: UpdateBrandInput) {
    return this.BrandsService.update(slugOrId, updateInput)
  }
  
  @Delete(':field')
  @UseAuthGuard(Permissions.DELETE_BRAND)
  remove(@Param('field') id: string) {
    return this.BrandsService.remove(id);
  }
}
