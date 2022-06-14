import { NetworkModule } from './../network/module';
import { SettingModule } from './../settings/module';
import { forwardRef, Global, Module } from '@nestjs/common';
import { Web3Controller } from './controller';
import { Web3Service } from './service';

@Global()
@Module({
  controllers: [Web3Controller],
  providers: [Web3Service],
  imports: [forwardRef(() => SettingModule), forwardRef(() => NetworkModule)],
  exports: [Web3Service]
})
export class Web3Module {}
