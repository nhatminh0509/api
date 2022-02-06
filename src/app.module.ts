import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://nhatminh0509:nhaT0509@kathena-demo-shard-00-00.26nei.mongodb.net:27017,kathena-demo-shard-00-01.26nei.mongodb.net:27017,kathena-demo-shard-00-02.26nei.mongodb.net:27017/api?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=true'),
    UsersModule, 
    OrgsModule,
    FilesModule,
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
