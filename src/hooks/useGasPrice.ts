import Web3 from 'web3'
import { crosschainConfig } from 'constants/CrosschainConfig'

export default async function useGasPrice(): Promise<string> {
  const web3 = await new Web3(crosschainConfig.chains[0].rpcUrl)
  return await web3.eth.getGasPrice()
}
