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

const imports = [
  AuthModule,
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
