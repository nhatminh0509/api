import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInInput } from './auth.type';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  create(@Body() body: SignInInput) {
    return this.authService.signIn(body)
  }

  @Get('/permissions')
  findAllPermissions() {
    return this.authService.getPermissions()
  }
}
