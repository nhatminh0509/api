import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { SettingService } from './service';
import { CreateSettingInput } from './type';

@ApiTags('Setting')
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Post()
  @UseAuthGuard(Permissions.CREATE_SETTING)
  create(@Body() body: CreateSettingInput) {
    return this.settingService.create({ ...body });
  }
}
