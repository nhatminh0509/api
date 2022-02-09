import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrgsModule } from 'src/orgs/orgs.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role, RoleSchema } from './roles.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]), forwardRef(() => UsersModule), forwardRef(() => OrgsModule)],
  exports: [AuthService]
})
export class AuthModule {}
