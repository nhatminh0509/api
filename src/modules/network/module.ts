import { Global, Module } from '@nestjs/common';
import { NetworkService } from './service';
import { NetworkController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Network, NetworkSchema } from './model';

@Global()
@Module({
  controllers: [NetworkController],
  providers: [NetworkService],
  imports: [MongooseModule.forFeature([{ name: Network.name, schema: NetworkSchema }])],
  exports: [NetworkService]
})
export class NetworkModule {}
