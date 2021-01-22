import { AppDispatch, AppState } from '../index'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import {
  CrosschainChain, CrosschainToken,
  ProposalStatus, setApproveStatus,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID, setDeposiStatus, setTargetChain,
  setTransferAmount
} from './actions'
import { BridgeConfig, ChainbridgeConfig, crosschainConfig, TokenConfig } from '../../constants/CrosschainConfig'
import { ChainId } from '@zeroexchange/sdk'
import Web3 from 'web3'
import {
  BigNumber,
  BigNumberish,
  ContractTransaction,
  ethers,
  Overrides,
  PayableOverrides,
  utils
} from 'ethers'

const BridgeABI = require('../../constants/abis/Bridge.json').abi
const TokenABI = require('../../constants/abis/ERC20PresetMinterPauser.json').abi

var dispatch: AppDispatch
var web3React: any
var crosschainState: AppState['crosschain']

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

function WithDecimals(value: string | number): string {
  if (typeof (value) !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value,18)
}

function WithoutDecimalsHexString(value: string): string {
  console.log('BigNumber.from(utils.parseUnits(value, 18)).toHexString()', BigNumber.from(utils.parseUnits(value, 18)).toHexString())
  return BigNumber.from(utils.parseUnits(value, 18)).toHexString()
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

function GetChainbridgeConfigByTokenAddress(address: string): BridgeConfig {
  let result: BridgeConfig | undefined
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    chain.tokens.map((token: TokenConfig) => {
      if (token.address === address) {
        result = chain
      }
    })
  }))
  if (!result) {
    throw Error(`unknown id ${address}`)
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

function GetAvailableTokens(chainName: string): Array<CrosschainToken> {
  const result: Array<CrosschainToken> = []
  crosschainConfig.chains.map(((chain: BridgeConfig) => {
    if (chain.name === chainName) {
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

async function UpdateOwnTokenBalance() {
  const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
  const signer = web3React.library.getSigner()
  const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)

  const balance = (await tokenContract.balanceOf(web3React.account)).toString()
  dispatch(setCurrentTokenBalance({
    balance: WithDecimals(balance)
  }))
}

async function UpdateFee() {
  const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

  const signer = web3React.library.getSigner()
  const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

  const fee = (await bridgeContract._fee()).toString()

  dispatch(setCrosschainFee({
    value: WithDecimals(fee)
  }))
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
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    dispatch(setAvailableChains({
      chains: GetAvailableChains(GetChainNameById(chainId || -1))
    }))

    dispatch(setAvailableTokens({
      tokens: []
    }))
    dispatch(setTargetChain({
      chain: {
        name: '',
        chainID: ''
      }
    }))
    dispatch(setCurrentChain({
      chain: {
        name: '',
        chainID: ''
      }
    }))
    dispatch(setCurrentToken({
      token: {
        name: '',
        address: ''
      }
    }))
    dispatch(setTransferAmount({ amount: '' }))
  }, [])

  // change target chain
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))

    dispatch(setAvailableTokens({
      tokens: GetAvailableTokens(currentChain.name)
    }))
  }, [targetChain])

  // to address
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    UpdateOwnTokenBalance().catch(console.error)
  }, [account, currentToken])


  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    const currentChainName = GetChainNameById(chainId || -1)
    const chains = GetAvailableChains(currentChainName)
    dispatch(setAvailableChains({
      chains: chains
    }))

    const newTargetCain = chains.length ? chains[0] : {
      name: '',
      chainID: ''
    }

    const tokens = GetAvailableTokens(currentChainName)
    dispatch(setAvailableTokens({
      tokens: tokens.length ? tokens : []
    }))
    dispatch(setTargetChain({
      chain: newTargetCain
    }))
    dispatch(setCurrentChain({
      chain: GetCurrentChain(currentChainName)
    }))

    dispatch(setCurrentToken({
      token: tokens.length ? tokens[0] : {
        name: '',
        address: ''
      }
    }))
    dispatch(setTransferAmount({ amount: '' }))
    UpdateOwnTokenBalance().catch(console.error)
    UpdateFee().catch(console.error)
  }, [chainId])
}

export async function MakeApprove() {
  const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
  const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
  //
  // const web3CurrentChain = new Web3(currentChain.rpcUrl)
  // const tokenContract = new web3CurrentChain.eth.Contract(TokenABI, currentToken.address, {
  //   from: web3React.account,
  //   gasPrice: '20000000000'
  // })
  // console.log('tokenContract', tokenContract)
  // const rawTX = tokenContract.methods.approve(currentChain.bridgeAddress, crosschainState.transferAmount).encodeABI();
  // var decodedTx = txDecoder.decodeTx(rawTX);

  dispatch(setCurrentTxID({
    txID: ''
  }))

  const signer = web3React.library.getSigner()
  const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
  console.log("currentChain.bridgeAddress, crosschainState.transferAmount", currentChain.erc20HandlerAddress, crosschainState.transferAmount)
  const result = await tokenContract.approve(currentChain.erc20HandlerAddress, WithoutDecimalsHexString(crosschainState.transferAmount), {
    gasLimit: '300000'
  })

  dispatch(setApproveStatus({
    confirmed: false
  }))
  dispatch(setCurrentTxID({
    txID: result.hash
  }))

  result.wait(2).then(() => {
    dispatch(setApproveStatus({
      confirmed: true
    }))
  })

  dispatch(setApproveStatus({
    confirmed: true
  }))
}

export async function MakeDeposit() {
  const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
  const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
  const targetChain = GetChainbridgeConfigByID(crosschainState.targetChain.chainID)
  const targetToken = targetChain.tokens[0]

  console.log("currentChain", currentChain)
  console.log("targetChain", targetChain)
  console.log("targetToken", targetToken)
  console.log("currentToken", currentToken)
  console.log("crosschainState.currentToken", crosschainState.currentToken)
  console.log("currentChain.bridgeAddress", currentChain.bridgeAddress)

  dispatch(setCurrentTxID({
    txID: ''
  }))

  const signer = web3React.library.getSigner()
  const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

  console.log("_fee", (await bridgeContract._fee()).toString())

  console.log("crosschainState.transferAmount", crosschainState.transferAmount)
  console.log("crosschainState.currentRecipient", crosschainState.currentRecipient)
  const data =
    '0x' +
    utils
      .hexZeroPad(
        // TODO Wire up dynamic token decimals
        WithoutDecimalsHexString(crosschainState.transferAmount),
        32
      )
      .substr(2) + // Deposit Amount (32 bytes)
    utils
      .hexZeroPad(utils.hexlify((crosschainState.currentRecipient.length - 2) / 2), 32)
      .substr(2) + // len(recipientAddress) (32 bytes)
    crosschainState.currentRecipient.substr(2) // recipientAddress (?? bytes)
  console.log(">>>>>>>>>>>>>>>",targetChain.chainId, currentToken.resourceId, data)
  console.log("_totalRelayersm", await bridgeContract._totalRelayers().catch(console.error))
  const result = await bridgeContract.deposit(targetChain.chainId, currentToken.resourceId, data, {
    gasLimit: '800000',
    value: WithoutDecimalsHexString(crosschainState.crosschainFee),
  }).catch(console.error)

  dispatch(setDeposiStatus({
    confirmed: false
  }))
  dispatch(setCurrentTxID({
    txID: result.hash
  }))

  result.wait(2).then(() => {
    dispatch(setDeposiStatus({
      confirmed: true
    }))
  })
}