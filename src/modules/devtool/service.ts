import { ethers, Wallet } from 'ethers';
import { forwardRef, Inject, OnApplicationBootstrap } from "@nestjs/common";
import { AuthService } from "src/core/auth/auth.service";
import { Logger } from "src/core/common/Logger";
import { BrandsService } from "../brand/service";
import { CategoryService } from "../category/service";
import { KeywordService } from "../keyword/service";
import { OrgsService } from "../orgs/service";
import { ProductsService } from "../product/service";
import { UsersService } from "../users/service";
import seedData from "./seedData";

export class DevtoolService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DevtoolService.name)
  constructor(
    @Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private readonly userService: UsersService,
    @Inject(forwardRef(() => OrgsService)) private readonly orgService: OrgsService,
    @Inject(forwardRef(() => KeywordService)) private readonly keywordService: KeywordService,
    @Inject(forwardRef(() => ProductsService)) private readonly productService: ProductsService,
    @Inject(forwardRef(() => CategoryService)) private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => BrandsService)) private readonly brandService: BrandsService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(this.onApplicationBootstrap.name)
    return this.devToolsBootstrap()
  }

  async devToolsBootstrap() {
    try {
      // Find not found => insert data
      // const providers = new ethers.providers.JsonRpcProvider('http://95.179.192.46:9650/ext/bc/21Z7pN9Z6VfmMo8jjhDQYyYJS5MB7MftZSuKrmenhmwADCWWJH/rpc')
      // const wallet = new Wallet()
      await this.orgService.findOne(seedData.org.slug)
    } catch (_) {
      // Handle insert seed data
      
      // Org
      const org = await this.orgService.create({
        ...seedData.org
      })
      this.logger.log('Generate org')

      // Role
      await this.authService.createRoles({
        ...seedData.role,
        orgId: org?._id
      })
      this.logger.log('Generate role')
      
      // User
      await this.userService.create({
        ...seedData.user
      })
      this.logger.log('Generate user')
      
    }
  }
}
