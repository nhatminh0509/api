import { TransactionLogModule } from './../modules/transaction-log/module';
import { SearchModule } from './../modules/search/module';
import { ProductsModule } from './../modules/product/module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/module';
import { BrandsModule } from 'src/modules/brand/module';
import { CategoryModule } from 'src/modules/category/module';
import { RelationshipCategoryBrandModule } from 'src/modules/relationship-category-brand/module';
import { OrgsModule } from 'src/modules/orgs/module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/modules/files/module';
import { AuthModule } from './auth/auth.module';
import { KeywordModule } from 'src/modules/keyword/module';
import { DevtoolModule } from 'src/modules/devtool/module';
import config from './common/config';
import { SettingModule } from 'src/modules/settings/module';
import { Web3Module } from 'src/modules/web3/module';
import { NetworkModule } from 'src/modules/network/module';

const imports = [
  AuthModule,
  SettingModule,
  Web3Module,
  TransactionLogModule,
  NetworkModule,
  OrgsModule,
  UsersModule, 

  BrandsModule,
  CategoryModule,
  ProductsModule,
  RelationshipCategoryBrandModule,
  ...(config.ENABLE_DEVTOOL_MODULE ? [DevtoolModule] : []),

  KeywordModule,
  FilesModule,
  SearchModule,
  
  MongooseModule.forRoot(config.MONGO_URI),
]

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
    }
}
