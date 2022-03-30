import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "src/core/common/constants";
import { Logger } from "src/core/common/Logger";
import { AuthService } from "./auth.service";
import Permissions from "../permissions";
import HTTP_STATUS from "../common/httpStatus";

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name)

  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<Permissions>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredPermission) return true

    const request = context.switchToHttp().getRequest()
    const user = request?.user
    const domain = request.headers.origin

    const permission = await this.authService.userHasPermissions(user._id, domain || 'http://localhost:5500', requiredPermission)
  
    if (permission) {
      return permission
    }
    throw HTTP_STATUS.FORBIDDEN(`User not has permission: ${requiredPermission}`)
  }
}