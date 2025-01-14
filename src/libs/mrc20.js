import tokens from 'libs/token.json'
import config from 'libs/config'
import server from 'libs/server'
import abi from 'ethjs-abi'
import metrix from 'metrixjs-lib'

function loadTokenList(network) {
  let tokenList = tokens[network].concat(config.get(`tokenList_${network}`, []))
  tokenList.sort((a, b) => {
    return a.symbol > b.symbol ? 1 : -1
  })
  console.log(tokenList)
  return tokenList
}

export default {
  getTokenList() {
    return loadTokenList(config.getNetwork())
  },

  addCustomToken(address, name, symbol, decimals) {
    const network = config.getNetwork()
    if (tokens[network].find(item => address === item.address)) {
      return true
    }
    const savedTokenList = config.get(`tokenList_${network}`, [])
    const index = savedTokenList.findIndex(item => address === item.address)
    savedTokenList[index === -1 ? savedTokenList.length : index] = {
      name,
      symbol,
      address,
      decimals,
    }
    config.set(`tokenList_${network}`, savedTokenList, 365 * 86400)
  },

  async fetchTokenInfo(contractAddress) {
    try {
      let result = await server.currentNode().getTokenInfo()
      let tokenlist = result.tokens;
      for (let i = 0; tokenlist.length; i++) {
        if(tokenlist[i].address === contractAddress) {
          return tokenlist[i]
        }
      }
      return null
      //return await server.currentNode().getTokenInfo()
    } catch (e) {
      throw 'this contract is not a mrc20 token'
    }
  },

  checkSymbol(symbol) {
    const tokenList = loadTokenList(config.getNetwork())
    return tokenList.filter((token) => {
      return token.symbol === symbol
    }).length > 0
  },

  getTokenBySymbol(symbol) {
    const tokenList = loadTokenList(config.getNetwork())
    return tokenList.filter((token) => {
      return token.symbol === symbol
    })[0]
  },

  encodeSendData(token, address, amount) {
    return 'a9059cbb' + abi.encodeParams(['address', 'uint256'], ['0x' + metrix.address.fromBase58Check(address)['hash'].toString('hex'), amount * Math.pow(10, token.decimals)]).substr(2)
  }
}
