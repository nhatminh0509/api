import { NULL_ADDRESS } from './../../../core/common/constants';
import { CHECK_LOG_TIME } from 'src/core/common/constants';
import CommonService from 'src/core/singleton';
import Web3Services from "./Web3Services"
import { abiOrgNFT } from './abi/OrgNFT';
import { ethers } from 'ethers';
import axios from 'axios';
import HandleLogOrgNFT from './handle-logs/OrgNFT';
const CONTRACT_NFT = ['0x8faa7370790f52fd83bbf24747a100f8e7df7508']

const TOPIC_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

export default class GetPastLogs {
  private currentBlock: number | null = null
  private addresses: []
  private slug

  constructor(slug: string) {
    this.slug = slug
  }

  async checkBlock () {
    try {
      const resNetwork = await CommonService.networkService.findOne({ slug: this.slug })
      if (resNetwork.enable) {
        if (this.currentBlock === null) {
          const configAddress: any = await CommonService.settingService.findOne('configAddress')
          this.currentBlock = resNetwork.currentBlock
          this.addresses = configAddress.value.addresses
        }
        if (!this.currentBlock) {
          this.currentBlock = await Web3Services.getLastestBlock(resNetwork.rpc)
          if (!this.currentBlock) {
              return setTimeout(() => this.checkBlock(), CHECK_LOG_TIME);
          }
          await CommonService.networkService.update({ slug: resNetwork.slug }, { currentBlock: this.currentBlock, updateBlockAt: new Date() })
        }
        const latestBlock = await Web3Services.getLastestBlock(resNetwork.rpc);
        let logs = null;
        if (this.currentBlock < latestBlock) {
            logs = await Web3Services.getPastLogsRange(resNetwork.rpc, this.currentBlock + 1, latestBlock, this.addresses);
        } else {
            return setTimeout(() => this.checkBlock(), CHECK_LOG_TIME);
        }
        if (logs) {
            await this.processLog(logs, resNetwork._id)
            await CommonService.networkService.update({ slug: resNetwork.slug },{currentBlock: latestBlock, updateBlockAt: new Date()});
        }
        this.currentBlock = latestBlock
        setTimeout(() => this.checkBlock(), CHECK_LOG_TIME);
      } else {
        console.log(`End get block ${this.slug}`, new Date());
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => this.checkBlock(), CHECK_LOG_TIME);
    }
  }

  async processLog(logs, networkId){
    for (const log of logs) {
      if (CONTRACT_NFT.map(item => item.toLowerCase()).includes(log.address.toLowerCase())) {
        HandleLogOrgNFT.handle(log, networkId)
      }
    }
  }
}