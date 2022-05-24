import { Global, Module } from '@nestjs/common';
import { UsersService } from './service';
import { UsersController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model';

@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [UsersService]
})
export class UsersModule {}
