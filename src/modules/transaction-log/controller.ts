import {
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionLogService } from './service';

@ApiTags('TransactionLog')
@Controller('transaction-log')
export class TransactionLogController {
  constructor(private readonly transactionLogService: TransactionLogService) {}
}
