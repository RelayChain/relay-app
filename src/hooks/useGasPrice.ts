import Web3 from 'web3'
import { crosschainConfig as crosschainConfigTestnet } from '../constants/CrosschainConfigTestnet'
import { getCrosschainState } from 'state/crosschain/hooks'

const { allCrosschainData } = getCrosschainState()
const crosschainConfig = process.env.REACT_APP_TESTNET ? crosschainConfigTestnet : allCrosschainData

export default async function useGasPrice(): Promise<string> {
  const web3 = await new Web3(crosschainConfig.chains[0].rpcUrl)
  return await web3.eth.getGasPrice()
}
