import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OrgsModule } from './orgs/orgs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGOO_URI),
    UsersModule, 
    OrgsModule],
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
