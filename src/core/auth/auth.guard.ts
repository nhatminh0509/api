import { CanActivate, ExecutionContext, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import config from "src/core/common/config";
import { Logger } from "src/core/common/Logger";
import { verify } from 'jsonwebtoken'
import { UsersService } from "src/modules/users/service";
import HTTP_STATUS from "../common/httpStatus";
import { OrgsService } from "src/modules/orgs/service";

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name)

    constructor(
      private readonly userService: UsersService,
      private readonly orgService: OrgsService,
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
          throw HTTP_STATUS.FORBIDDEN('Forbidden resource: No token is provided')
        }

        try {
          const tokenData = verify(token, config.JWT_SECRET)

          const { userId } = tokenData as any
    
          request.userId = userId
    
          if (!userId) throw HTTP_STATUS.FORBIDDEN('Forbidden resource: User Id not found')
    
          const user = await this.userService.findOne(userId)
          // TODO
          // const org = await this.orgService.findOneByDomain(request?.headers?.origin)
          const org = await this.orgService.findOneByDomain('http://localhost:5500')

          if (!user) throw HTTP_STATUS.FORBIDDEN('Forbidden resource: User not found')
    
          user.lastActivityAt = new Date()
          await user.save()
    
          request.user = user
          request.org = org
          return true
        } catch (error) {
          this.logger.debug(error)
          return false
        }
      }

}