import { TransactionLogService } from './../modules/transaction-log/service';
import { NetworkService } from './../modules/network/service';
import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import { SettingService } from 'src/modules/settings/service';
import CommonService from './singleton';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => SettingService))private readonly settingService: SettingService,
    @Inject(forwardRef(() => NetworkService))private readonly networkService: NetworkService,
    @Inject(forwardRef(() => TransactionLogService))private readonly transactionLogService: TransactionLogService,
  ) {}


  onApplicationBootstrap() {
    CommonService.networkService = this.networkService
    CommonService.settingService = this.settingService
    CommonService.transactionLogService = this.transactionLogService
  }

  async getHello() {
    const res = await axios.get('https://dev-api.nftpod.io/setting')
    return res.data
  }
}
