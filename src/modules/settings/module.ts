import { Global, Module } from '@nestjs/common';
import { SettingService } from './service';
import { SettingController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './model';

@Global()
@Module({
  controllers: [SettingController],
  providers: [SettingService],
  imports: [MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }])],
  exports: [SettingService]
})
export class SettingModule {}
