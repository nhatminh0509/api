import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UseAuthGuard } from 'src/core/auth/auth.decorator';
import Permissions from 'src/core/permissions';
import { FilesService } from './service';


class UploadInput {
  @ApiProperty({ required: true })
  file: string
}

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseAuthGuard(Permissions.FILE_UPLOAD)
  create(@Body() body: UploadInput) {
    const { file } = body
    return this.filesService.upload(file)
  }
}
