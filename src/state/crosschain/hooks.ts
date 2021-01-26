import { BigNumber, ethers, utils } from 'ethers'
import { BridgeConfig, TokenConfig, crosschainConfig } from '../../constants/CrosschainConfig'
import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  ProposalStatus,
  setAvailableChains,
  setAvailableTokens, setCrosschainDepositConfirmed,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapDetails,
  setCrosschainTransferStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID,
  setTargetChain,
  setTargetTokens,
  setTransferAmount, SwapDetails
} from './actions'
import store, { AppDispatch, AppState } from '../index'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ChainId } from '@zeroexchange/sdk'
import { initialState } from './reducer'
import { useActiveWeb3React } from '../../hooks'
import Web3 from 'web3'
import { Bridge } from '@chainsafe/chainbridge-contracts/dist/ethers/Bridge'

const BridgeABI = require('../../constants/abis/Bridge.json').abi
const TokenABI = require('../../constants/abis/ERC20PresetMinterPauser.json').abi

var dispatch: AppDispatch
var web3React: any

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

function getCrosschainState(): AppState['crosschain'] {
  return store.getState().crosschain || initialState
}

function WithDecimals(value: string | number): string {
  if (typeof (value) !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value, 18)
}

function WithoutDecimalsHexString(value: string): string {
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
        chainID: String(chain.chainId),
        symbol: chain.nativeTokenSymbol
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
          chainId: chain.chainId,
          address: token.address,
          name: token.name || '',
          symbol: token.symbol || '',
          decimals: token.decimals,
          imageUri: token.imageUri,
          resourceId: token.resourceId,
          isNativeWrappedToken: token.isNativeWrappedToken,
          assetBase: token.assetBase
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

export function useCrosschainHooks() {
  dispatch = useDispatch()
  web3React = useActiveWeb3React()

  const BreakCrosschainSwap = () => {
    dispatch(setCurrentTxID({
      txID: ''
    }))
    dispatch(setCrosschainTransferStatus({
      status: ChainTransferState.NotStarted
    }))

    dispatch(setCrosschainSwapDetails({
      details: {
        status: ProposalStatus.INACTIVE,
        voteCount: 0
      }
    }))

    dispatch(setCrosschainDepositConfirmed({
      confirmed: false
    }))
  }

  const MakeDeposit = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    const targetChain = GetChainbridgeConfigByID(crosschainState.targetChain.chainID)

    dispatch(setCurrentTxID({
      txID: ''
    }))

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

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

    const resultDepositTx = await bridgeContract.deposit(targetChain.chainId, currentToken.resourceId, data, {
      gasLimit: '800000',
      value: WithoutDecimalsHexString(crosschainState.crosschainFee),
      gasPrice: utils.parseUnits(String(currentChain.defaultGasPrice || 30), 9)
    }).catch(console.error)

    if (!resultDepositTx) {
      return
    }

    await resultDepositTx.wait(1)

    dispatch(setCrosschainDepositConfirmed({
      confirmed: true
    }))

    const web3CurrentChain = new Web3(currentChain.rpcUrl)
    const receipt = await web3CurrentChain.eth.getTransactionReceipt(resultDepositTx.hash)

    let nonce = receipt.logs[2].topics[3]
    console.log('nonce', nonce);

    dispatch(setCurrentTxID({
      txID: resultDepositTx.hash
    }))
    dispatch(setCrosschainTransferStatus({
      status: ChainTransferState.TransferPending
    }))

    UpdateOwnTokenBalance().catch(console.error)

    {
      while (true) {
        try {
          await delay(5000);
          console.log("process proposal")
          const web3TargetChain = new Web3(targetChain.rpcUrl)
          const destinationBridge = new web3TargetChain.eth.Contract(BridgeABI, targetChain.bridgeAddress)
          const proposal = await destinationBridge.methods.getProposal(currentChain.chainId, nonce,web3TargetChain.utils.keccak256(targetChain.erc20HandlerAddress + data.slice(2))).call().catch()
          console.log('proposal',proposal)
          dispatch(setCrosschainSwapDetails({
            details: {
              status: proposal._status,
              voteCount: !!proposal?._yesVotes ? proposal._yesVotes.length : 0
            }
          }))
          if (proposal && proposal._status == ProposalStatus.EXECUTED) {
            dispatch(setCrosschainTransferStatus({
              status: ChainTransferState.TransferComplete
            }))
            break
          }
        }catch (e) {
          console.error(e)
        }
      }
    }
  }

  const MakeApprove = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)

    dispatch(setCurrentTxID({
      txID: ''
    }))
    dispatch(setCrosschainTransferStatus({
      status: ChainTransferState.NotStarted
    }))

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
    const resultApproveTx = await tokenContract.approve(currentChain.erc20HandlerAddress, WithoutDecimalsHexString(crosschainState.transferAmount), {
      gasLimit: '300000',
      gasPrice: utils.parseUnits(String(currentChain.defaultGasPrice || 30), 9)
    })

    dispatch(setCrosschainTransferStatus({
      status: ChainTransferState.ApprovalPending
    }))
    dispatch(setCurrentTxID({
      txID: resultApproveTx.hash
    }))

    resultApproveTx.wait(1).then(() => {
      let crosschainState = getCrosschainState()
      if (crosschainState.currentTxID === resultApproveTx.hash) {
        dispatch(setCurrentTxID({
          txID: ''
        }))
        dispatch(setCrosschainTransferStatus({
          status: ChainTransferState.ApprovalComplete
        }))
      }
    })
  }

  const UpdateOwnTokenBalance = async () => {
    const crosschainState = getCrosschainState()
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)

    const balance = (await tokenContract.balanceOf(web3React.account)).toString()
    dispatch(setCurrentTokenBalance({
      balance: WithDecimals(balance)
    }))
  }

  const UpdateFee = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

    const fee = (await bridgeContract._fee()).toString()

    dispatch(setCrosschainFee({
      value: WithDecimals(fee)
    }))
  }

  return {
    MakeDeposit,
    MakeApprove,
    UpdateFee,
    UpdateOwnTokenBalance,
    BreakCrosschainSwap
  }
}

export function useCrossChain() {
  dispatch = useDispatch()
  web3React = useActiveWeb3React()
  const {
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

  const { UpdateOwnTokenBalance, UpdateFee } = useCrosschainHooks()

  const { account, library } = useActiveWeb3React()
  const chainIdFromWeb3React = useActiveWeb3React().chainId

  const chainId = library?._network?.chainId || chainIdFromWeb3React

  const initAll = () => {
    const {
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
    } = getCrosschainState()
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
    const targetTokens = GetAvailableTokens(newTargetCain?.name)
    dispatch(setAvailableTokens({
      tokens: tokens.length ? tokens : []
    }))
    dispatch(setTargetTokens({
      targetTokens: targetTokens.length ? targetTokens : []
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
  }

  useEffect(initAll, [])
  useEffect(initAll, [chainId, library])

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
    UpdateFee().catch(console.error)
  }, [account, currentToken])
}
