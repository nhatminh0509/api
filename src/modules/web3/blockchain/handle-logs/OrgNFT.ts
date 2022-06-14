import axios from "axios"
import { ethers } from "ethers"
import ChatWork from "src/core/chatwork"
import { NULL_ADDRESS } from "src/core/common/constants"
import CommonService from "src/core/singleton"
import { abiOrgNFT } from "../abi/OrgNFT"

const TOPIC_TRANSFER = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

export default class HandleLogOrgNFT {
  static async handle (log, networkId) {
    switch (log.topics[0]) {
      case TOPIC_TRANSFER:
        await this.transfer(log, networkId)
        // let iface = new ethers.utils.Interface(abiOrgNFT) 
        // const data = iface.parseLog(log)
        // if (data.args.from === NULL_ADDRESS) {
        //   const resLog = await CommonService.transactionLogService.create({
        //     hash: log.transactionHash,
        //     data: {
        //       from :data.args.from, 
        //       to: data.args.to, 
        //       tokenId: data.args.tokenId.toString()
        //     },
        //     functionName: 'mint-org-nft',
        //     networkId
        //   })
        //   if (resLog._id) {
        //     // Handle save mint nft
        //     console.log('mint',data.args.from, data.args.to, data.args.tokenId.toString())
        //     ChatWork.sendMessage(`Mint: contract ${log.address} tokenId: ${data.args.tokenId.toString()} from ${data.args.from} to ${data.args.to} with hash ${log.transactionHash}`)
        //   }
        // } else if (data.args.to === NULL_ADDRESS) {
        //   const resLog = await CommonService.transactionLogService.create({
        //     hash: log.transactionHash,
        //     data: {
        //       from :data.args.from, 
        //       to: data.args.to, 
        //       tokenId: data.args.tokenId.toString()
        //     },
        //     functionName: 'burn-org-nft',
        //     networkId 
        //   })
        //   if (resLog._id) {
        //     // Handle save burn nft
        //     console.log('burn',data.args.from, data.args.to, data.args.tokenId.toString())
        //     ChatWork.sendMessage(`Burn: contract ${log.address} tokenId: ${data.args.tokenId.toString()} from ${data.args.from} to ${data.args.to} with hash ${log.transactionHash}`)
        //   }
        // } else {
        //   const resLog = await CommonService.transactionLogService.create({
        //     hash: log.transactionHash,
        //     data: {
        //       from :data.args.from, 
        //       to: data.args.to, 
        //       tokenId: data.args.tokenId.toString()
        //     },
        //     functionName: 'transfer-org-nft',
        //     networkId 
        //   })
        //   if (resLog._id) {
        //     // Handle save transfer nft
        //     console.log('transfer',data.args.from, data.args.to, data.args.tokenId.toString())
        //     ChatWork.sendMessage(`Transfer: contract ${log.address} tokenId: ${data.args.tokenId.toString()} from ${data.args.from} to ${data.args.to} with hash ${log.transactionHash}`)
        //   }
        // }
        return
      default:
        break;
    }
  }

  static async transfer (log, networkId) {
    let iface = new ethers.utils.Interface(abiOrgNFT) 
    const data = iface.parseLog(log)
    if (data.args.from === NULL_ADDRESS) {
      CommonService.transactionLogService.create({
        hash: log.transactionHash,
        data: {
          from :data.args.from, 
          to: data.args.to, 
          tokenId: data.args.tokenId.toString()
        },
        functionName: 'mint-org-nft',
        networkId
      }).then(async () => {
        console.log('mint',data.args.from, data.args.to, data.args.tokenId.toString())
        await ChatWork.sendMessage(`Mint: contract ${log.address} tokenId: ${data.args.tokenId.toString()} from ${data.args.from} to ${data.args.to} with hash ${log.transactionHash}`)
      }).catch((e) => {})
    } else if (data.args.to === NULL_ADDRESS) {
        CommonService.transactionLogService.create({
          hash: log.transactionHash,
          data: {
            from :data.args.from, 
            to: data.args.to, 
            tokenId: data.args.tokenId.toString()
          },
          functionName: 'burn-org-nft',
          networkId 
        }).then(async () => {
          console.log('burn',data.args.from, data.args.to, data.args.tokenId.toString())
          ChatWork.sendMessage(`Burn: contract ${log.address} tokenId: ${data.args.tokenId.toString()} from ${data.args.from} to ${data.args.to} with hash ${log.transactionHash}`)
        }).catch((e) => {})
      }
  }
}