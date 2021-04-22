import { BigNumber, ethers, utils } from 'ethers'
import { crosschainConfig as crosschainConfigTestnet } from '../../constants/CrosschainConfigTestnet'
import {
  BridgeConfig,
  TokenConfig,
  crosschainConfig as crosschainConfigMainnet
} from '../../constants/CrosschainConfig'
import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  ProposalStatus,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainDepositConfirmed,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapDetails,
  setCrosschainTransferStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID,
  setPendingTransfer,
  setTargetChain,
  setTargetTokens,
  setTransferAmount
} from './actions'
import store, { AppDispatch, AppState } from '../index'
import { useDispatch, useSelector } from 'react-redux'

import { ChainId } from '@zeroexchange/sdk'
import Web3 from 'web3'
import { initialState } from './reducer'
import { useActiveWeb3React } from '../../hooks'
import { useEffect } from 'react'
import useGasPrice from 'hooks/useGasPrice'

// import { afterWrite } from '@popperjs/core'

const BridgeABI = require('../../constants/abis/Bridge.json').abi
const TokenABI = require('../../constants/abis/ERC20PresetMinterPauser.json').abi
// eslint-disable-next-line @typescript-eslint/no-var-requires
const USDTTokenABI = require('../../constants/abis/USDTABI.json')

const crosschainConfig = process.env.REACT_APP_TESTNET ? crosschainConfigTestnet : crosschainConfigMainnet

let dispatch: AppDispatch
let web3React: any

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

function getCrosschainState(): AppState['crosschain'] {
  return store.getState().crosschain || initialState
}

function WithDecimals(value: string | number): string {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value, 18)
}

function WithDecimalsHexString(value: string, decimals: number): string {
  return BigNumber.from(utils.parseUnits(value, decimals)).toHexString()
}

function GetCurrentChain(currentChainName: string): CrosschainChain {
  let result: CrosschainChain = {
    name: '',
    chainID: ''
  }
  for (const chain of crosschainConfig.chains) {
    if (chain.name === currentChainName) {
      result = {
        name: chain.name,
        chainID: String(chain.chainId),
        symbol: chain.nativeTokenSymbol
      }
    }
  }
  return result
}

function GetChainbridgeConfigByID(chainID: number | string): BridgeConfig {
  if (typeof chainID === 'string') {
    chainID = Number(chainID)
  }
  let result: BridgeConfig = {
    chainId: -1,
    networkId: -1,
    name: '',
    bridgeAddress: '',
    erc20HandlerAddress: '',
    rpcUrl: '',
    tokens: [],
    nativeTokenSymbol: '',
    type: 'Ethereum'
  }
  for (const chain of crosschainConfig.chains) {
    if (chain.chainId === chainID) {
      result = chain
    }
  }
  return result
}

export function GetTokenByAddress(address: string): TokenConfig {
  let result: TokenConfig = {
    address: '',
    decimals: 18,
    resourceId: '',
    assetBase: ''
  }
  for (const chain of crosschainConfig.chains) {
    for (const token of chain.tokens) {
      if (token.address === address) {
        result = token
        return result
      }
    }
  }
  return result
}

function GetAvailableChains(currentChainName: string): Array<CrosschainChain> {
  const result: Array<CrosschainChain> = []
  for (const chain of crosschainConfig.chains) {
    if (chain.name !== currentChainName) {
      result.push({
        name: chain.name,
        chainID: String(chain.chainId)
      })
    }
  }
  return result
}

function GetAvailableTokens(chainName: string): Array<CrosschainToken> {
  const result: Array<CrosschainToken> = []
  for (const chain of crosschainConfig.chains) {
    if (chain.name === chainName) {
      for (const token of chain.tokens) {
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
      }
    }
  }
  return result
}

function GetChainNameById(chainID: number): string {
  if (chainID === ChainId.MAINNET) {
    return 'Ethereum'
  } else if (chainID === ChainId.RINKEBY) {
    return 'Rinkeby'
  } else if (chainID === ChainId.FUJI) {
    return 'Avalanche'
  } else if (chainID === ChainId.AVALANCHE) {
    return 'Avalanche'
  } else if (chainID === ChainId.SMART_CHAIN) {
    return 'Smart Chain'
  } else if (chainID === ChainId.SMART_CHAIN_TEST) {
    return 'Smart Chain'
  }
  return ''
}

export function useCrosschainHooks() {
  dispatch = useDispatch()
  web3React = useActiveWeb3React()

  const BreakCrosschainSwap = () => {
    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.NotStarted
      })
    )

    dispatch(
      setCrosschainSwapDetails({
        details: {
          status: ProposalStatus.INACTIVE,
          voteCount: 0
        }
      })
    )

    dispatch(
      setCrosschainDepositConfirmed({
        confirmed: false
      })
    )

    dispatch(
      setPendingTransfer({
        pendingTransfer: {}
      })
    )
  }

  const getNonce = async (): Promise<number> => {
    return await web3React.library.getSigner().getTransactionCount()
  }

  const MakeDeposit = async () => {
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.TransferPending
      })
    )

    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    const targetChain = GetChainbridgeConfigByID(crosschainState.targetChain.chainID)
    const currentGasPrice = await useGasPrice()
    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    const signer = web3React.library.getSigner()
    const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

    const data =
      '0x' +
      utils
        .hexZeroPad(
          // TODO Wire up dynamic token decimals
          WithDecimalsHexString(crosschainState.transferAmount, currentToken.decimals),
          32
        )
        .substr(2) + // Deposit Amount (32 bytes)
      utils.hexZeroPad(utils.hexlify((crosschainState.currentRecipient.length - 2) / 2), 32).substr(2) + // len(recipientAddress) (32 bytes)
      crosschainState.currentRecipient.substr(2) // recipientAddress (?? bytes)
    const gasPriceFromChain =
      crosschainState.currentChain.name === 'Ethereum'
        ? WithDecimalsHexString(currentGasPrice, 0)
        : WithDecimalsHexString(String(currentChain.defaultGasPrice || 470), 9)
    const resultDepositTx = await bridgeContract
      .deposit(targetChain.chainId, currentToken.resourceId, data, {
        gasLimit: '500000',
        value: WithDecimalsHexString(crosschainState.crosschainFee, 18 /*18 - AVAX/ETH*/),
        gasPrice: gasPriceFromChain,
        nonce: await getNonce()
      })
      .catch((err: any) => {
        console.log(err)
        BreakCrosschainSwap()
      })

    if (!resultDepositTx) {
      return
    }

    await resultDepositTx.wait()

    dispatch(
      setCrosschainDepositConfirmed({
        confirmed: true
      })
    )

    const web3CurrentChain = new Web3(currentChain.rpcUrl)
    const receipt = await web3CurrentChain.eth.getTransactionReceipt(resultDepositTx.hash)

    const nonce = receipt.logs[receipt.logs.length - 1].topics[3]

    dispatch(
      setCurrentTxID({
        txID: resultDepositTx.hash
      })
    )
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.TransferComplete
      })
    )

    const state = getCrosschainState()
    const pendingTransfer = {
      currentSymbol: state?.currentToken?.symbol,
      targetSymbol: state?.targetTokens?.find(x => x.assetBase === state?.currentToken?.assetBase)?.symbol,
      assetBase: state?.currentToken?.assetBase,
      amount: state?.transferAmount,
      decimals: state?.currentToken?.decimals,
      name: state?.targetChain?.name,
      address: state?.currentToken?.address,
      status: state?.swapDetails?.status,
      votes: state?.swapDetails?.voteCount
    }

    dispatch(
      setPendingTransfer({
        pendingTransfer
      })
    )

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    UpdateOwnTokenBalance().catch(console.error)

    while (true) {
      try {
        await delay(5000)
        const web3TargetChain = new Web3(targetChain.rpcUrl)
        const destinationBridge = new web3TargetChain.eth.Contract(BridgeABI, targetChain.bridgeAddress)
        const proposal = await destinationBridge.methods
          .getProposal(
            currentChain.chainId,
            nonce,
            web3TargetChain.utils.keccak256(targetChain.erc20HandlerAddress + data.slice(2))
          )
          .call()
          .catch()
        dispatch(
          setCrosschainSwapDetails({
            details: {
              status: proposal._status,
              voteCount: !!proposal?._yesVotes ? proposal._yesVotes.length : 0
            }
          })
        )

        if (proposal && proposal._status === ProposalStatus.EXECUTED) {
          await delay(5000)
          BreakCrosschainSwap()
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const GetAllowance = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
    const approvedAmount = await tokenContract.allowance(
      crosschainState.currentRecipient,
      currentChain.erc20HandlerAddress
    )
    const countTokenForTransfer = BigNumber.from(
      WithDecimalsHexString(crosschainState.transferAmount, currentToken.decimals)
    )
    if (countTokenForTransfer.lte(approvedAmount)) {
      dispatch(
        setCrosschainTransferStatus({
          status: ChainTransferState.ApprovalComplete
        })
      )
    } else {
      console.log('not approved before')
    }
  }

  const MakeApprove = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    const currentGasPrice = await useGasPrice()
    dispatch(
      setCurrentTxID({
        txID: ''
      })
    )
    dispatch(
      setCrosschainTransferStatus({
        status: ChainTransferState.NotStarted
      })
    )

    const gasPriceFromChain =
      crosschainState.currentChain.name === 'Ethereum'
        ? WithDecimalsHexString(currentGasPrice, 0)
        : WithDecimalsHexString(String(currentChain.defaultGasPrice || 470), 9)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const usdtAddress =
      crosschainState.availableTokens.find(token => token.symbol === 'USDT')?.address ??
      '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    // https://forum.openzeppelin.com/t/can-not-call-the-function-approve-of-the-usdt-contract/2130/2
    const isUsdt = currentToken.address === usdtAddress
    const ABI = isUsdt ? USDTTokenABI : TokenABI
    const transferAmount = isUsdt ? String(Number.MAX_SAFE_INTEGER) : crosschainState.transferAmount
    const tokenContract = new ethers.Contract(currentToken.address, ABI, signer)
    tokenContract
      .approve(currentChain.erc20HandlerAddress, WithDecimalsHexString(transferAmount, currentToken.decimals), {
        gasLimit: '50000',
        gasPrice: gasPriceFromChain,
        nonce: await getNonce()
      })
      .then((resultApproveTx: any) => {
        dispatch(
          setCrosschainTransferStatus({
            status: ChainTransferState.ApprovalPending
          })
        )
        dispatch(
          setCurrentTxID({
            txID: resultApproveTx.hash
          })
        )

        resultApproveTx
          .wait()
          .then(() => {
            const crosschainState = getCrosschainState()
            const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
            return tokenContract.allowance(crosschainState.currentRecipient, currentChain.erc20HandlerAddress)
          })
          .then((approvedAmount: any) => {
            const crosschainState2 = getCrosschainState()
            if (crosschainState2.currentTxID === resultApproveTx.hash) {
              const countTokenForTransfer = BigNumber.from(
                WithDecimalsHexString(crosschainState2.transferAmount, currentToken.decimals)
              )
              if (countTokenForTransfer.gte(approvedAmount)) {
                dispatch(
                  setCurrentTxID({
                    txID: ''
                  })
                )
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.ApprovalComplete
                  })
                )
              } else {
                dispatch(
                  setCrosschainTransferStatus({
                    status: ChainTransferState.NotStarted
                  })
                )
              }
            }
          })
          .catch((err: any) => {
            BreakCrosschainSwap()
          })
      })
      .catch((err: any) => {
        BreakCrosschainSwap()
      })
  }

  const UpdateOwnTokenBalance = async () => {
    const crosschainState = getCrosschainState()
    const currentToken = GetTokenByAddress(crosschainState.currentToken.address)
    // @ts-ignore
    const signer = web3React.library.getSigner()
    const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)

    const balance = (await tokenContract.balanceOf(web3React.account)).toString()
    dispatch(
      setCurrentTokenBalance({
        balance: WithDecimals(balance)
      })
    )
  }

  const UpdateFee = async () => {
    const crosschainState = getCrosschainState()
    const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

    const fee = (await bridgeContract._fee()).toString()

    dispatch(
      setCrosschainFee({
        value: WithDecimals(fee)
      })
    )
  }

  return {
    MakeDeposit,
    MakeApprove,
    UpdateFee,
    GetAllowance,
    UpdateOwnTokenBalance,
    BreakCrosschainSwap
  }
}

export function useCrossChain() {
  dispatch = useDispatch()
  web3React = useActiveWeb3React()

  const { currentChain, targetChain, currentToken } = useCrosschainState()

  const { UpdateOwnTokenBalance, UpdateFee } = useCrosschainHooks()

  const { account, library } = useActiveWeb3React()
  const chainIdFromWeb3React = useActiveWeb3React().chainId


  const chainId = library?._network?.chainId || chainIdFromWeb3React

  const initAll = () => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))
    const currentChainName = GetChainNameById(chainId || -1)

    const chains = GetAvailableChains(currentChainName)
    dispatch(
      setAvailableChains({
        chains: chains
      })
    )

    const newTargetCain = chains.length
      ? targetChain
      : {
        name: '',
        chainID: ''
      }

    const tokens = GetAvailableTokens(currentChainName)
    const targetTokens = GetAvailableTokens(newTargetCain?.name)
    dispatch(
      setAvailableTokens({
        tokens: tokens.length ? tokens : []
      })
    )
    dispatch(
      setTargetTokens({
        targetTokens: targetTokens.length ? targetTokens : []
      })
    )
    dispatch(
      setTargetChain({
        chain: newTargetCain
      })
    )
    dispatch(
      setCurrentChain({
        chain: GetCurrentChain(currentChainName)
      })
      
    )
    dispatch(setTransferAmount({ amount: '' }))
    UpdateOwnTokenBalance().catch(console.error)
    UpdateFee().catch(console.error)    
  }
  

  useEffect(initAll, [])
  useEffect(initAll, [chainId, library])

  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))

    dispatch(
      setAvailableTokens({
        tokens: GetAvailableTokens(currentChain.name)
      })
    )
  }, [targetChain, account, currentChain])

  // to address
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    UpdateOwnTokenBalance().catch(console.error)
    UpdateFee().catch(console.error)
  }, [account, currentToken])
}
