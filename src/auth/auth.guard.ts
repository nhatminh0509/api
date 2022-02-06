import { CanActivate, ExecutionContext, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import config from "src/common/config";
import { Logger } from "src/common/Logger";
import { verify } from 'jsonwebtoken'

@Injectable({ scope: Scope.REQUEST })
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name)

    constructor(
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
        return false
        // try {
        //   const tokenData = verify(token, config.JWT_SECRET)
    
        //   const { userId } = tokenData
    
        //   ctx.accountId = accountId
        //   ctx.orgId = orgId
    
        //   if (!(accountId && orgId)) return false
    
        //   // eslint-disable-next-line @typescript-eslint/dot-notation
        //   const account = await this.accountService['accountModel'].findById(
        //     accountId,
        //   )
    
        //   if (!account) return false
    
        //   account.lastActivityAt = new Date()
        //   await account.save()
    
        //   ctx.account = account
    
        //   // eslint-disable-next-line @typescript-eslint/dot-notation
        //   const org = await this.orgService['orgModel'].findById(orgId)
    
        //   if (!org) return false
    
        //   ctx.org = org
    
        //   return true
        // } catch (error) {
        //   this.logger.debug(error)
        //   return false
        // }
      }

}