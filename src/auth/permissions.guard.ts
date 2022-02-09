import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "src/common/constants";
import { Logger } from "src/common/Logger";
import { AuthService } from "./auth.service";
import Permissions from "./permissions";

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
    console.log(domain, requiredPermission)

    await this.authService.userHasPermissions(user._id, 'http://localhost:5500', requiredPermission)

    return true
  }
}