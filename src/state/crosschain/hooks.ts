import { AppDispatch, AppState } from '../index'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import {
  CrosschainChain, CrosschainToken,
  ProposalStatus,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID, setTargetChain,
  setTransferAmount
} from './actions'
import { BridgeConfig, ChainbridgeConfig, crosschainConfig, TokenConfig } from '../../constants/CrosschainConfig'
import { ChainId } from '@zeroexchange/sdk'
import Web3 from 'web3'


var dispatch: AppDispatch
var web3React: any
var crosschainState: AppState['crosschain']

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

function GetCurrentChain(currentChainName: string): CrosschainChain {
  let result: CrosschainChain = {
    name: '',
    chainID: ''
  }
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    if (chain.name === currentChainName) {
      result = {
        name: chain.name,
        chainID: String(chain.chainId)
      }
    }
  }))
  return result
}

function GetChainbridgeConfigByID(chainID: number | string): BridgeConfig {
  if (typeof (chainID) === 'string') {
    chainID = Number(chainID)
  }
  let result: BridgeConfig | undefined
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    if (chain.chainId === chainID) {
      result = chain
    }
  }))
  if (!result) {
    throw Error(`unknown id ${chainID}`)
  }
  return result
}

function GetTokenByAddress(address: string): TokenConfig {
  let result: TokenConfig | undefined
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    chain.tokens.map((token: TokenConfig) => {
      if (token.address === address) {
        result = token
      }
    })
  }))
  if (!result) {
    throw Error(`unknown id ${address}`)
  }
  return result
}

function GetAvailableChains(currentChainName: string): Array<CrosschainChain> {
  const result: Array<CrosschainChain> = []
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    if (chain.name !== currentChainName) {
      result.push({
        name: chain.name,
        chainID: String(chain.chainId)
      })
    }
  }))
  return result
}

function GetAvailableTokens(currentChainName: string): Array<CrosschainToken> {
  const result: Array<CrosschainToken> = []
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    if (chain.name !== currentChainName) {
      chain.tokens.map((token: TokenConfig) => {
        const t = {
          address: token.address,
          name: token.name || '',
          symbol: token.symbol || '',
          imageUri: token.imageUri,
          resourceId: token.resourceId,
          isNativeWrappedToken: token.isNativeWrappedToken
        }
        result.push(t)
      })
    }
  }))
  return result
}

function GetChainNameById(chainID: number): string {
  if (chainID === ChainId.MAINNET) {
    return 'Ethereum'
  } else if (chainID === ChainId.RINKEBY) {
    return 'Ethereum'
  } else if (chainID === ChainId.FUJI) {
    return 'Avalanche'
  }
  return ''
}

export function useCrossChain() {
  dispatch = useDispatch<AppDispatch>()

  const {
    swapStatus,
    currentRecipient,
    currentTxID,
    availableChains,
    availableTokens,
    currentChain,
    currentToken,
    currentBalance,
    transferAmount,
    crosschainFee,
    targetChain
  } = useCrosschainState()
  crosschainState = useCrosschainState()

  const { account, chainId, library } = useActiveWeb3React()
  web3React = useActiveWeb3React()

  // init mock
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    dispatch(setAvailableChains({
      chains: GetAvailableChains(GetChainNameById(chainId || -1))
    }))

    dispatch(setAvailableTokens({
      tokens: []
    }))
    dispatch(setTargetChain({
      chain: {
        name: 'Ethereum',
        chainID: '45'
      }
    }))
    dispatch(setCurrentChain({
      chain: {
        name: 'Avalanche',
        chainID: '5'
      }
    }))
    dispatch(setCurrentToken({
      token: {
        name: 'GHJ',
        address: '0xE323c3089999999999999999999999999b45F303'
      }
    }))
    dispatch(setCurrentTokenBalance({ balance: '67867867' }))
    dispatch(setTransferAmount({ amount: '3455' }))
    dispatch(setCrosschainFee({ value: '5677' }))
  }, [])

  // change target chain
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: '' }))
    dispatch(setCurrentTxID({ txID: '' }))

    dispatch(setAvailableTokens({
      tokens: GetAvailableTokens(currentChain.name)
    }))
  }, [targetChain])

  // to address
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
  }, [account])


  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    const chains = GetAvailableChains(GetChainNameById(chainId || -1))
    dispatch(setAvailableChains({
      chains: chains
    }))

    const tokens = GetAvailableTokens(currentChain.name)
    dispatch(setAvailableTokens({
      tokens: tokens.length ? tokens : []
    }))
    dispatch(setTargetChain({
      chain: chains.length ? chains[0] : {
        name: '',
        chainID: ''
      }
    }))
    dispatch(setCurrentChain({
      chain: GetCurrentChain(GetChainNameById(chainId || -1))
    }))

    dispatch(setCurrentToken({
      token: tokens.length ? tokens[0] : {
        name: '',
        address: ''
      }
    }))
    dispatch(setCurrentTokenBalance({ balance: '' }))
    dispatch(setTransferAmount({ amount: '' }))
    dispatch(setCrosschainFee({ value: '' }))
  }, [chainId])
}

export async function MakeApprove() {
  window.alert('approve')
  console.log('current chain', )
  const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

  const web3CurrentChain = new Web3(currentChain.rpcUrl)
  console.log('account', (web3React.account))
  console.log('>>>>>>>>>>>>>>>>>>>>balance', await web3CurrentChain.eth.getBalance(web3React.account))
}

export async function MakeDeposit() {
  window.alert('deposit')
}