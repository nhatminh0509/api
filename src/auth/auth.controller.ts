import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { domainToASCII } from 'url';
import { CurrentOrgDomain } from './auth.decorator';
import { AuthService } from './auth.service';
import { SignInInput } from './auth.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  create(@CurrentOrgDomain() domain, @Body() body: SignInInput) {
    return this.authService.signIn(domain, body)
  }

  @Get('/permissions')
  findAllPermissions() {
    return this.authService.getPermissions()
  }
}
