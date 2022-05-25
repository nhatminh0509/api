import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RelationshipCategoryBrandService } from './service';
import { QueryListRelationshipCategoryBrand } from './type';

@ApiTags('Relationship-Category-Brand')
@Controller('relationship-category-brand')
export class RelationshipCategoryBrandController {
  constructor(private readonly relationshipService: RelationshipCategoryBrandService) {}

  @Get()
  findAll(@Query() query: QueryListRelationshipCategoryBrand) {
    return this.relationshipService.findAll(query);
  }
}
