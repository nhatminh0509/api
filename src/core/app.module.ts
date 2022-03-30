import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { OrgsModule } from '../modules/orgs/orgs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from '../modules/files/files.module';
import { AuthModule } from './auth/auth.module';
import config from './common/config';

@Module({
  imports: [
    OrgsModule,
    UsersModule, 
    FilesModule,
    AuthModule,
    MongooseModule.forRoot(config.MONGO_URI),
  ],
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
