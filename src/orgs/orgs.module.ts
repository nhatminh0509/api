import { Module } from '@nestjs/common';
import { OrgsService } from './orgs.service';
import { OrgsController } from './orgs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Org, OrgSchema } from './orgs.model';

@Module({
  controllers: [OrgsController],
  providers: [OrgsService],
  imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])],
})
export class OrgsModule {}
