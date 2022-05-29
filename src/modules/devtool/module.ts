import { forwardRef, Global, Module } from '@nestjs/common';
import { DevtoolService } from './service';
import { ProductsModule } from '../product/module';
import { CategoryModule } from '../category/module';
import { OrgsModule } from '../orgs/module';
import { KeywordModule } from '../keyword/module';
import { UsersModule } from '../users/module';
import { AuthModule } from 'src/core/auth/auth.module';
import { BrandsModule } from '../brand/module';

@Global()
@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => OrgsModule),
    forwardRef(() => KeywordModule), 
    forwardRef(() => ProductsModule), 
    forwardRef(() => CategoryModule),
    forwardRef(() => BrandsModule),
  ],
  providers: [DevtoolService],
})
export class DevtoolModule {}
