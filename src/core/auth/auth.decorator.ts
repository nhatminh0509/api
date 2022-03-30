import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { PERMISSION_KEY } from 'src/core/common/constants';
import { AuthGuard } from './auth.guard';
import Permissions from '../permissions';
import { PermissionGuard } from './permissions.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)

export const CurrentOrgDomain = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.headers.origin || ''
  }
)

export const UseAuthGuard = (permissions?: Permissions) =>
  applyDecorators(
    SetMetadata(PERMISSION_KEY, permissions),
    ApiBearerAuth(),
    UseGuards(AuthGuard, PermissionGuard),
  )
