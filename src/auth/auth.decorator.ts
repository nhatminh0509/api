import { applyDecorators, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import Permissions from './permissions';

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
    UseGuards(AuthGuard),
  )
