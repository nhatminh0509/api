import {
  Controller, Get, Query,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { SearchService } from './service';
import { Search } from './type';

@ApiTags('Search')
@Controller('searchs')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query() query: Search) {
    return this.searchService.search(query);
  }

}
