import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentOrg, UseAuthGuard } from 'src/core/auth/auth.decorator';
import { KeywordService } from './service';
import { NewKeyword, QueryListKeyword } from './type';

@ApiTags('Keyword')
@Controller('keywords')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  @UseAuthGuard()
  create(@CurrentOrg() org, @Body() body: NewKeyword) {
    return this.keywordService.newKeyword({ ...body, orgId: org?._id });
  }

  @Get()
  findAll(@Query() query: QueryListKeyword) {
    return this.keywordService.findAll(query);
  }
}
