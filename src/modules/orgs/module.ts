import { forwardRef, Global, Module } from '@nestjs/common';
import { OrgsService } from './service';
import { OrgsController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Org, OrgSchema } from './model';

@Global()
@Module({
  controllers: [OrgsController],
  providers: [OrgsService],
  imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])],
  exports: [OrgsService]
})
export class OrgsModule {}
