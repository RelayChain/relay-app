import { BigNumber, ethers, utils } from 'ethers'
import { BridgeConfig, TokenConfig } from '../../constants/CrosschainConfig'
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
import { useActiveWeb3React, useEagerConnect } from '../../hooks'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { ChainId } from '@zeroexchange/sdk'
import Web3 from 'web3'
import { getBalanceOnHandler, liquidityChecker } from 'api'
import getGasPrice from 'hooks/getGasPrice'
// import { crosschainConfig as crosschainConfigTestnet } from '../../constants/CrosschainConfigTestnet'
import { initialState } from './reducer'

const BridgeABI = require('../../constants/abis/Bridge.json').abi
// const BridgeABI = require('../../constants/abis/OldBridge.json')
const TokenABI = require('../../constants/abis/ERC20PresetMinterPauser.json').abi
const TOKEN_DEPOSITER_ABI = require('../../constants/abis/TokenDepositer.json')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const USDTTokenABI = require('../../constants/abis/USDTABI.json')

const erc20Interface = new ethers.utils.Interface(TokenABI)
const tokenDepositerInterface = new ethers.utils.Interface(TOKEN_DEPOSITER_ABI)

function getChainIdAs8Bytes(chainId: number) {
  const hexxed = ethers.utils.hexlify(chainId)
  const padded = ethers.utils.hexZeroPad(hexxed, 8)
  return padded.slice(2)
}

// Before there was USDT
const NO_AUX_DATA_TOKENS: string[] = []; 


// const crosschainConfig = process.env.REACT_APP_TESTNET ? crosschainConfigTestnet : crosschainConfigMainnet

let dispatch: AppDispatch
let web3React: any
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

export function getCrosschainState(): AppState['crosschain'] {
  return store.getState().crosschain || initialState
}

export function WithDecimals(value: string | number, decimals?: number): string {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return utils.formatUnits(value, decimals ?? 18)
}

export function WithDecimalsHexString(value: string, decimals: number): string {
  if (!value || decimals === undefined) {
    return ''
  }
  return BigNumber.from(utils.parseUnits(value, decimals)).toHexString()
}

function GetCurrentChain(currentChainName: string): CrosschainChain {
  const { allCrosschainData } = getCrosschainState()
  let result: CrosschainChain = {
    name: '',
    chainID: ''
  }
  const chains = allCrosschainData?.chains
  if (chains && chains.length > 0) {
    chains?.map(chain => {
      if (chain.name === currentChainName) {
        result = {
          name: chain.name,
          chainID: String(chain.chainId),
          symbol: chain.nativeTokenSymbol,
          marketPlace: chain.marketPlace,
          blockExplorer: chain.blockExplorer,
          rpcUrl: chain.rpcUrl
        }
        if (chain.exchangeContractAddress && chain.rateZeroToRelay && chain.zeroContractAddress) {
          const exchangeFields = {
            exchangeContractAddress: chain.exchangeContractAddress,
            rateZeroToRelay: chain.rateZeroToRelay,
            zeroContractAddress: chain.zeroContractAddress
          }
          result = { ...result, ...exchangeFields }
        }
      }
    })
  }
  return result
}

export function GetChainbridgeConfigByID(chainID: number | string): BridgeConfig {
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
  const { allCrosschainData } = getCrosschainState()
  for (const chain of allCrosschainData?.chains) {
    if (chain.chainId === chainID) {
      result = chain
    }
  }
  return result
}

export function GetTokenByAddrAndChainId(
  address: string,
  chainId: string,
  resourceId: string,
  name: string
): TokenConfig {
  let result: TokenConfig = {
    address: '',
    decimals: 18,
    resourceId: '',
    assetBase: '',
    allowedChainsToTransfer: []
  }
  const { allCrosschainData } = getCrosschainState()
  const tokens = allCrosschainData?.chains?.find(c => String(c.chainId) === chainId)?.tokens ?? []
  const possibleTokens = tokens.filter(
    t => t.address.toLowerCase() === address.toLowerCase() && t.name?.toLowerCase() === name?.toLowerCase()
  )

  if (!possibleTokens) return result

  if (possibleTokens.length == 1) return possibleTokens[0]

  if (possibleTokens.length > 1) {
    return possibleTokens.find(t => t.resourceId.toLowerCase() == resourceId.toLowerCase()) || result
  }

  return result
}

function GetAvailableChains(currentChainName: string): Array<CrosschainChain> {
  const result: Array<CrosschainChain> = []
  const { allCrosschainData } = getCrosschainState()
  const chains = allCrosschainData?.chains
  if (chains && chains?.length > 0) {
    chains?.map(chain => {
      if (chain.name !== currentChainName) {
        result.push({
          name: chain.name,
          chainID: String(chain.chainId)
        })
      }
    })
  }

  return result
}

export function GetAvailableTokens(chainName: string, targetChainId?: number): Array<CrosschainToken> {
  const result: Array<CrosschainToken> = []
  const { allCrosschainData } = getCrosschainState()
  const chains = allCrosschainData?.chains
  if (chains && chains.length > 0) {
    chains?.map(chain => {
      if (chain.name === chainName) {
        for (const token of chain.tokens) {
          if (token.allowedChainsToTransfer?.some(id => id === targetChainId)) {
            if (
              (chain.chainId === 2 &&
                targetChainId === 6 &&
                token.address === '0xc7198437980c041c805A1EDcbA50c1Ce5db95118') ||
              (chain.chainId === 2 &&
                targetChainId === 6 &&
                token.address === '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70') ||
              (chain.chainId === 2 &&
                targetChainId === 10 &&
                token.address === '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7') ||
              (chain.chainId === 13 &&
                targetChainId === 3 &&
                token.address === '0x338A6997011c4eee53822837c4F95bBbA3a0a7f5')
            ) {
            } else {
              const t = {
                chainId: chain.chainId,
                address: token.address,
                name: token.name || '',
                symbol: token.symbol || '',
                decimals: token.decimals,
                imageUri: token.imageUri,
                resourceId: token.resourceId,
                isNativeWrappedToken: token.isNativeWrappedToken,
                assetBase: token.assetBase,
                // @ts-ignore
                disableTransfer: token.disableTransfer,
                allowedChainsToTransfer: token.allowedChainsToTransfer
              }
              result.push(t)
            }
          }
        }
      }
    })
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
    return 'Smart Chain Testnet'
  } else if (chainID === ChainId.MOONBASE_ALPHA) {
    return 'Moonbeam'
  } else if (chainID === ChainId.MUMBAI) {
    return 'Mumbai'
  } else if (chainID === ChainId.MATIC) {
    return 'Polygon'
  } else if (chainID === ChainId.HECO) {
    return 'HECO'
  } else if (chainID === ChainId.MOONRIVER) {
    return 'Moonriver'
  } else if (chainID === ChainId.FANTOM) {
    return 'Fantom'
  } else if (chainID === ChainId.SHIDEN) {
    return 'Shiden'
  } else if (chainID === ChainId.IOTEX) {
    return 'Iotex'
  } else if (chainID === ChainId.HARMONY) {
    return 'Harmony'
  } else if (chainID === ChainId.CRONOS) {
    return 'Cronos'
  } else if (chainID === ChainId.OKEX) {
    return 'OKEx'
  } else if (chainID === ChainId.MULTIVAC) {
    return 'MultiVAC'
  } else if (chainID === ChainId.METIS_NETWORK) {
    return 'Metis Network'
  } else if (chainID === ChainId.MOONBEAM) {
    return 'Moonbeam'
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

  const MakeDeposit = async () => {
    const crosschainState = getCrosschainState()

    try {
      const currentGasPrice = await getGasPrice(+crosschainState.currentChain.chainID)
      const gasPriceDecimal = WithDecimals(currentGasPrice)
      const crossChainFee = WithDecimalsHexString(crosschainState.crosschainFee, 18)
      const isInsuffient = +crosschainState.userBalance <= +gasPriceDecimal * 200000 + +crosschainState.crosschainFee

      if (isInsuffient) {
        dispatch(setCrosschainTransferStatus({ status: ChainTransferState.Insufficient }))
        return Promise.reject()
      }

      dispatch(setCrosschainTransferStatus({ status: ChainTransferState.TransferPending }))

      const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
      const currentToken = GetTokenByAddrAndChainId(
        crosschainState.currentToken.address,
        crosschainState.currentChain.chainID,
        crosschainState.currentToken.resourceId,
        crosschainState.currentToken.name
      )
      const targetChain = GetChainbridgeConfigByID(crosschainState.targetChain.chainID)

      dispatch(setCurrentTxID({ txID: '' }))

      const signer = web3React.library.getSigner()

      if (currentChain.type == 'Ethereum') {
        const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)

        const data =
          '0x' +
          utils.hexZeroPad(WithDecimalsHexString(crosschainState.transferAmount, currentToken.decimals), 32).slice(2) + // Deposit Amount (32 bytes)
          utils.hexZeroPad(utils.hexlify(20), 32).slice(2) + // len(recipientAddress) (32 bytes)
          crosschainState.currentRecipient.slice(2) // recipientAddress (20 bytes)
        const auxData = '0x00'

        // If a chain id is not present here, it will be undefined.
        // Then the provider will calculate it on it's own.
        const gasLimit = {
          14: 1200000
        }[currentChain.chainId]

        const resultDepositTx = await bridgeContract.deposit(
          targetChain.chainId,
          currentToken.resourceId,
          data,
          auxData,
          {
            gasPrice: currentGasPrice,
            gasLimit,
            value: crossChainFee
          }
        )

        await resultDepositTx.wait()

        dispatch(setCrosschainDepositConfirmed({ confirmed: true }))
        dispatch(setCurrentTxID({ txID: resultDepositTx.hash }))
        dispatch(setCrosschainTransferStatus({ status: ChainTransferState.TransferComplete }))

        UpdateOwnTokenBalance().catch(e => console.error(`UpdateOwnTokenBalance err`, e))

        return Promise.resolve()
      } else if (currentChain.type == 'EthTransfers') {
        const fromTokenAddr = ethers.utils.getAddress(currentToken.address)
        const amountWei = ethers.utils.parseUnits(crosschainState.transferAmount, currentToken.decimals)

        const auxData = [
          currentToken.resourceId.slice(2), // 32 bytes
          '14', // recipient length
          crosschainState.currentRecipient.slice(2), // recipient
          getChainIdAs8Bytes(targetChain.chainId)
        ].join('')

        let tx
        if (fromTokenAddr == ethers.constants.AddressZero) {
          tx = await signer.sendTransaction({
            to: currentChain.bridgeAddress,
            value: amountWei,
            data: '0x' + auxData
          })
        } else if (NO_AUX_DATA_TOKENS.includes(fromTokenAddr)) {
          const funcFragment = tokenDepositerInterface.functions['deposit(address,uint256)']
          const txPayload = tokenDepositerInterface.encodeFunctionData(funcFragment, [fromTokenAddr, amountWei])
          tx = await signer.sendTransaction({
            to: currentChain.tokenDepositerAddr,
            data: txPayload + auxData
          })
        } else {
          const isBurnableResult = await liquidityChecker(String(currentChain.chainId), currentToken.resourceId)
          if (isBurnableResult.error) throw new Error(isBurnableResult.error)
          if (typeof isBurnableResult.shouldBurn !== 'boolean')
            throw new Error(`isBurnableResult.shouldBurn is compromised, ${isBurnableResult.shouldBurn}`)

          if (isBurnableResult.shouldBurn) {
            const funcFragment = erc20Interface.functions['burn(uint256)']
            const txPayload = erc20Interface.encodeFunctionData(funcFragment, [amountWei])
            tx = await signer.sendTransaction({
              to: fromTokenAddr,
              data: txPayload + auxData
            })
          } else {
            const funcFragment = erc20Interface.functions['transfer(address,uint256)']
            const txPayload = erc20Interface.encodeFunctionData(funcFragment, [currentChain.bridgeAddress, amountWei])
            tx = await signer.sendTransaction({
              to: fromTokenAddr,
              data: txPayload + auxData
            })
          }
        }

        await tx.wait()

        dispatch(setCrosschainDepositConfirmed({ confirmed: true }))
        dispatch(setCurrentTxID({ txID: tx.hash }))
        dispatch(setCrosschainTransferStatus({ status: ChainTransferState.TransferComplete }))

        return Promise.resolve()
      } else throw new Error(`Unknown type of fromChain for deposit, dunno whatta do`)
    } catch (err) {
      console.log(`MakeDeposit err`, err)
      dispatch(setCrosschainTransferStatus({ status: ChainTransferState.TransferFailed }))
      return Promise.reject(err)
    }
  }

  const GetAllowance = async () => {
    try {
      const crosschainState = getCrosschainState()
      const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

      const currentToken = GetTokenByAddrAndChainId(
        crosschainState.currentToken.address,
        crosschainState.currentChain.chainID,
        crosschainState.currentToken.resourceId,
        crosschainState.currentToken.name
      )

      let addressToCheck = currentChain.erc20HandlerAddress

      if (currentChain.type == 'EthTransfers' && currentChain.tokenDepositerAddr) {
        if (NO_AUX_DATA_TOKENS.includes(currentToken.address)) {
          console.log(
            `${currentToken.address} is a special token, approving for tokenDepositerAddr, because it doesn't accept auxData`
          )
          addressToCheck = currentChain.tokenDepositerAddr
        } else {
          console.log(`This is a EthTransfers chain, no need to approve`)
          dispatch(setCrosschainTransferStatus({ status: ChainTransferState.ApprovalComplete }))
          return
        }
      }

      // @ts-ignore
      const signer = web3React.library.getSigner()
      const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
      const approvedAmount = await tokenContract.allowance(crosschainState.currentRecipient, addressToCheck)

      const countTokenForTransfer = BigNumber.from(
        WithDecimalsHexString(crosschainState.transferAmount, currentToken.decimals)
      )

      if (approvedAmount && countTokenForTransfer.lte(approvedAmount)) {
        dispatch(setCrosschainTransferStatus({ status: ChainTransferState.ApprovalComplete }))
      } else {
        console.log('not approved before')
      }
    } catch (err) {
      console.log('GetAllowance error', err)
    }
  }

  const MakeApprove = async () => {
    const crosschainState = getCrosschainState()
    const currentChainId = +crosschainState.currentChain.chainID
    if (isNaN(currentChainId)) return Promise.reject(`MakeApprove: couldn't figure current chain id ${currentChainId}`)

    const currentGasPriceStringWei = getGasPrice(currentChainId)
    if (currentGasPriceStringWei == undefined)
      return Promise.reject(`MakeApprove: gas price for chain ${currentChainId} is ${currentGasPriceStringWei}`)

    const chainConfig = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
    const currentToken = GetTokenByAddrAndChainId(
      crosschainState.currentToken.address,
      crosschainState.currentChain.chainID,
      crosschainState.currentToken.resourceId,
      crosschainState.currentToken.name
    )

    if (currentToken == undefined) return Promise.reject(`MakeApprove: no current token`)

    // @ts-ignore
    const signer = web3React.library.getSigner()
    const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    // https://forum.openzeppelin.com/t/can-not-call-the-function-approve-of-the-usdt-contract/2130/2
    const isUsdt = currentToken.address === usdtAddress
    const isNoAuxData = NO_AUX_DATA_TOKENS.includes(currentToken.address)
    const ABI = isUsdt ? USDTTokenABI : TokenABI

    const approveAmount = isUsdt ? crosschainState.transferAmount : String(ethers.constants.MaxUint256)
    const tokenContract = new ethers.Contract(currentToken.address, ABI, signer)

    const addressToApprove = isNoAuxData ? chainConfig.tokenDepositerAddr : chainConfig.erc20HandlerAddress
    const approveParams = [addressToApprove, approveAmount]

    let estimatedGasLimit
    try {
      estimatedGasLimit = await tokenContract.estimateGas.approve(...approveParams)
    } catch (e) {
      return Promise.reject(`MakeApprove: couldn't predict gas limit for approve. ${e}`)
    }

    const feeForApprove = estimatedGasLimit.mul(currentGasPriceStringWei)
    const userGasTokenBalanceString = crosschainState.userBalance
    try {
      const userGasTokenBalanceBN = ethers.utils.parseEther(userGasTokenBalanceString)
      if (userGasTokenBalanceBN.lt(feeForApprove)) {
        dispatch(setCrosschainTransferStatus({ status: ChainTransferState.Insufficient }))
        return Promise.reject(
          `MakeApprove: insufficient gas token balance: ${userGasTokenBalanceBN} < ${feeForApprove}`
        )
      }
    } catch (e) {
      return Promise.reject(`MakeApprove: couldn't parse userGasTokenBalanceString ${userGasTokenBalanceString}`)
    }

    try {
      dispatch(setCurrentTxID({ txID: '' }))
      dispatch(setCrosschainTransferStatus({ status: ChainTransferState.ApprovalPending }))
      const tx = await tokenContract.approve(...approveParams, {
        gasPrice: currentGasPriceStringWei,
        gasLimit: estimatedGasLimit
      })
      dispatch(setCrosschainTransferStatus({ status: ChainTransferState.ApprovalSubmitted }))
      dispatch(setCurrentTxID({ txID: tx.hash }))
      return Promise.resolve('MakeApprove: success')
    } catch (e) {
      BreakCrosschainSwap()
      return Promise.reject(`MakeApprove: sending tx failed, ${e}`)
    }
  }

  const UpdateOwnTokenBalance = async () => {
    const crosschainState = getCrosschainState()
    const currentToken = GetTokenByAddrAndChainId(
      crosschainState.currentToken.address,
      crosschainState.currentChain.chainID,
      crosschainState.currentToken.resourceId,
      crosschainState.currentToken.name
    )

    // @ts-ignore
    const signer = web3React.library.getSigner()
    let balance
    if (currentToken.address !== '') {
      if (currentToken.address == ethers.constants.AddressZero) {
        balance = await signer.getBalance().then(String)
      } else {
        const tokenContract = new ethers.Contract(currentToken.address, TokenABI, signer)
        balance = await tokenContract.balanceOf(web3React.account).then(String)
      }

      dispatch(
        setCurrentTokenBalance({
          balance: WithDecimals(balance, currentToken.decimals)
        })
      )
    } else {
      dispatch(
        setCurrentTokenBalance({
          balance: '0.0000'
        })
      )
    }
  }

  const UpdateFee = async () => {
    const crosschainState = getCrosschainState()
    const currentToken = GetTokenByAddrAndChainId(
      crosschainState.currentToken.address,
      crosschainState.currentChain.chainID,
      crosschainState.currentToken.resourceId,
      crosschainState.currentToken.name
    )
    const targetChain = crosschainState.targetChain.chainID
    if (targetChain) {
      const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)

      if (currentChain.type == 'EthTransfers') {
        dispatch(setCrosschainFee({ value: '0' }))
        return
      }

      // @ts-ignore
      const signer = web3React.library.getSigner()
      const bridgeContract = new ethers.Contract(currentChain.bridgeAddress, BridgeABI, signer)
      const feeResult = await bridgeContract._fees(targetChain)
      const fee = feeResult.toString()
      const value = WithDecimals(fee)

      dispatch(setCrosschainFee({ value }))
    } else {
      dispatch(setCrosschainFee({ value: '0' }))
    }
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

    const newTargetChain = {
      name: '',
      chainID: ''
    }

    const tokens = GetAvailableTokens(currentChainName)
    const targetTokens = GetAvailableTokens(newTargetChain?.name)

    dispatch(
      setCurrentToken({
        token: {
          name: '',
          address: '',
          assetBase: '',
          symbol: '',
          decimals: 18,
          resourceId: '',
          allowedChainsToTransfer: []
        }
      })
    )

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
        chain: newTargetChain
      })
    )
    dispatch(
      setCurrentChain({
        chain: GetCurrentChain(currentChainName)
      })
    )

    dispatch(setTransferAmount({ amount: '' }))
    UpdateOwnTokenBalance() // .catch(console.error)
    UpdateFee().catch(e => console.error(`UpdateFee err`, e))
  }

  useEffect(initAll, [])
  useEffect(initAll, [chainId, library])
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    dispatch(setCurrentTxID({ txID: '' }))

    dispatch(
      setAvailableTokens({
        tokens: GetAvailableTokens(currentChain.name, +targetChain?.chainID)
      })
    )
    dispatch(
      setCurrentToken({
        token: {
          name: '',
          address: '',
          assetBase: '',
          symbol: '',
          decimals: 18,
          resourceId: '',
          allowedChainsToTransfer: []
        }
      })
    )
  }, [targetChain, account, currentChain])

  // to address
  useEffect(() => {
    dispatch(setCrosschainRecipient({ address: account || '' }))
    UpdateOwnTokenBalance().catch(console.error)
    UpdateFee().catch(console.error)
    // eslint-disable-next-line
  }, [account, currentToken, targetChain])
}

export function toCheckSumAddress(address: string) {
  const crosschainState = getCrosschainState()
  const currentChain = GetChainbridgeConfigByID(crosschainState.currentChain.chainID)
  const web3CurrentChain = window?.web3 ? new Web3(window?.web3?.currentProvider) : new Web3(currentChain.rpcUrl)
  return web3CurrentChain.utils.toChecksumAddress(address)
}
