import { TransactionLog, TransactionLogSchema } from './model';
import { Global, Module } from '@nestjs/common';
import { TransactionLogService } from './service';
import { TransactionLogController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  controllers: [TransactionLogController],
  providers: [TransactionLogService],
  imports: [MongooseModule.forFeature([{ name: TransactionLog.name, schema: TransactionLogSchema }])],
  exports: [TransactionLogService]
})
export class TransactionLogModule {}
