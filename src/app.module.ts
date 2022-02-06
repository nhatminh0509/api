import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import config from './common/config';

@Module({
  imports: [
    MongooseModule.forRoot(config.MONGO_URI),
    UsersModule, 
    OrgsModule,
    FilesModule,
    AuthModule
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
