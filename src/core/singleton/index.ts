import { TransactionLogService } from './../../modules/transaction-log/service';
import { SettingService } from 'src/modules/settings/service';
import { NetworkService } from "src/modules/network/service";

export default class CommonService {
  static networkService: NetworkService
  static settingService: SettingService
  static transactionLogService: TransactionLogService
}