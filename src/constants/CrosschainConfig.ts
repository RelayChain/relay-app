import { getCrossChainData } from "api"

export type TokenConfig = {
  chainId?: string
  address: string
  decimals: number
  name?: string
  symbol?: string
  imageUri?: string
  resourceId: string
  isNativeWrappedToken?: boolean
  assetBase: string
  disableTransfer?: boolean
  allowedChainsToTransfer?: number[]
}

export type BridgeConfig = {
  chainId: number
  networkId: number
  name: string
  bridgeAddress: string
  erc20HandlerAddress: string | `N/A, it's a eth-transfers chain`
  rpcUrl: string
  gasLimit?: number
  type: 'Ethereum' | 'Substrate' | 'EthTransfers'
  tokens: TokenConfig[]
  nativeTokenSymbol: string
  //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
  blockExplorer?: string
  defaultGasPrice?: number
  exchangeContractAddress?: string
  rateZeroToRelay?: number
  zeroContractAddress?: string
  relayContractAddress?: string
  marketPlace?: string
}

export type ChainbridgeConfig = {
  chains: BridgeConfig[]
}

export const csConfig = (): Promise<ChainbridgeConfig> => { 
  const crossChainConfigData = {} as ChainbridgeConfig
  return getCrossChainData<BridgeConfig[]>()
  .then((configs: BridgeConfig[]) => {
    crossChainConfigData.chains = configs
    return  crossChainConfigData
}) 
} 
