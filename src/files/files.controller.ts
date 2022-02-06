import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';


class UploadInput {
  @ApiProperty({ required: true })
  file: string
}

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() body: UploadInput) {
    const { file } = body
    return this.filesService.upload(file)
  }
}
