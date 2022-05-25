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
import { ProductsService } from './service';

@ApiTags('Product')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

}
