import { DisableWeb3Input, EnableWeb3Input } from './type';
import { forwardRef, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { NetworkService } from '../network/service';
import { SettingService } from '../settings/service';
import GetPastLogs from './blockchain/getPastLogs';
import axios from 'axios';

@Injectable()
export class Web3Service implements OnApplicationBootstrap {
  constructor(
    @Inject(forwardRef(() => SettingService))private readonly settingService: SettingService,
    @Inject(forwardRef(() => NetworkService))private readonly networkService: NetworkService,
  ) {}

  async onApplicationBootstrap() {
    // await axios({
    //   method: 'POST',
    //   url: 'https://api.chatwork.com/v2/rooms/278784929/messages',
    //   data: "body=Hello+Chatwork%21",
    //   headers: {
    //     "X-ChatWorkToken": "8665618fc548fe84b658492d7607f6d5"
    //   }
    // })
    setTimeout(async () => {
      const networks = await this.networkService.findAll()
      networks.map(async (network) => {
        const getPastLogsA = new GetPastLogs(network.slug)
        await getPastLogsA.checkBlock()
      })
    }, 3000)
  }

  async startCheck(input: EnableWeb3Input) {
    const network = await this.networkService.findOne({ slug: input.slug })
    if (!network.enable) {
      if (input.block) {
        await this.networkService.update({ slug: input.slug }, { enable: true, currentBlock: input.block, updateBlockAt: new Date() })
      } else {
        await this.networkService.update({ slug: input.slug }, { enable: true, currentBlock: Number(network.currentBlock) - 10, updateBlockAt: new Date() })
      }
      const getPastLogs = new GetPastLogs(network.slug)
      await getPastLogs.checkBlock()
    }
  }

  async stopCheck(input: DisableWeb3Input) {
    return await this.networkService.update({ slug: input.slug }, { enable: false })
  }
}
