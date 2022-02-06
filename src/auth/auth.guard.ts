import { CanActivate, ExecutionContext, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import config from "src/common/config";
import { Logger } from "src/common/Logger";
import { verify } from 'jsonwebtoken'
import { UsersService } from "src/users/users.service";

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name)

    constructor(
      private readonly userService: UsersService,
      @Inject(REQUEST) private request,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = request?.headers?.authorization?.replace(
          /^Bearer\s/,
          '',
        )
        if (!token) {
          this.logger.verbose(`No token is provided`)
          return false
        }

        try {
          const tokenData = verify(token, config.JWT_SECRET)

          const { userId } = tokenData as any
    
          request.userId = userId
    
          if (!userId) return false
    
          const user = await this.userService.findOne(userId)
    
          if (!user) return false
    
          user.lastActivityAt = new Date()
          await user.save()
    
          request.user = user
          return true
        } catch (error) {
          this.logger.debug(error)
          return false
        }
      }

}