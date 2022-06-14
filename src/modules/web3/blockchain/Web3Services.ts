import { ethers } from "ethers"
const Web3 = require("web3")

const BLOCK_LIMIT = 5000

class Web3Services {
  static async getLastestBlock (rpc) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    return web3.eth.getBlockNumber()
  }

  static async getPastLogs(rpc, fromBlock, toBlock, address, delay = 1000, maxTime = 10, repeat = 0) {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc))
    return web3.eth.getPastLogs({
      fromBlock,
      toBlock,
      address
    }).then(result => {
      if (result) return result
      if (repeat < maxTime) {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve(Web3Services.getPastLogs(fromBlock, toBlock, address, delay, maxTime, ++repeat));
          }, delay)
        })
      }
      return null
    }).catch((err) => {
      if (repeat < maxTime) {
        return new Promise((resolve) => {
          setTimeout(() => {
            return resolve(Web3Services.getPastLogs(fromBlock, toBlock, address, delay, maxTime, ++repeat));
          }, delay)
        })
      }
    })
  }

  static async getPastLogsRange(rpc, fromBlock, toBlock, address) {
    let logs = []
    for (fromBlock; fromBlock <= toBlock; fromBlock = fromBlock + BLOCK_LIMIT + 1) {
      const tlogs = await Web3Services.getPastLogs(rpc, fromBlock, fromBlock+BLOCK_LIMIT <= toBlock ? fromBlock+BLOCK_LIMIT : toBlock, address)
      if (tlogs!=null)
        logs = logs.concat(tlogs);
    }
    return logs
  }
}

export default Web3Services