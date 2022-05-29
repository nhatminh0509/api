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
import { CurrentOrg, CurrentOrgDomain, UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { ProductsService } from './service';
import { CreateProductInput, QueryListProduct } from './type';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  @UseAuthGuard()
  create(@CurrentOrg() org, @Body() body: CreateProductInput) {
    return this.productService.create({ ...body, orgSlug: org?.slug });
  }

  @Get()
  findAll(@Query() query: QueryListProduct) {
    return this.productService.findAll(query);
  }
}
