import { forwardRef, Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgsModule } from 'src/modules/orgs/module';
import { UsersModule } from 'src/modules/users/module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role, RoleSchema } from './roles.model';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]), forwardRef(() => UsersModule), forwardRef(() => OrgsModule)],
  exports: [AuthService]
})
export class AuthModule {}
