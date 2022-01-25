import { ChainbridgeConfig } from 'constants/CrosschainConfig'
import { createAction } from '@reduxjs/toolkit'

export enum ProposalStatus {
  INACTIVE = '0',
  ACTIVE = '1',
  PASSED = '2',
  EXECUTED = '3',
  CANCELLED = '4'
}

export interface CrosschainToken {
  name: string
  address: string
  assetBase: string
  symbol: string
  decimals: number
  disableTransfer?: boolean
  resourceId: string
  allowedChainsToTransfer?: number[]
}

export interface CrosschainChain {
  name: string
  chainID: string
  symbol?: string
  imageUri?: string
  resourceId?: string
  isNativeWrappedToken?: boolean
  assetBase?: string
  exchangeContractAddress?: string
  rateZeroToRelay?: number
  zeroContractAddress?: string
  relayContractAddress?: string
  marketPlace?: string
  blockExplorer?: string
  rpcUrl?: string
}

export enum ChainTransferState {
  NotStarted = 'NOT_STARTED',
  Insufficient = 'INSUFFICIENT_BALANCE',
  ApprovalPending = 'APPROVE_PENDING',
  ApprovalSubmitted = 'APPROVE_SUBMITTED',
  ApprovalComplete = 'APPROVE_COMPLETE',
  TransferPending = 'TRANSFER_PENDING',
  TransferComplete = 'TRANSFER_COMPLETE',
  TransferFailed = 'TRANSFER_FAILED'
}

export interface SwapDetails {
  status: ProposalStatus
  voteCount: number
}

export interface PendingTransfer {
  currentSymbol?: string
  targetSymbol?: string
  assetBase?: string
  amount?: string
  decimals?: number
  name?: string
  address?: string
  status?: string
  votes?: number
}

export const setCrosschainRecipient = createAction<{ address: string }>('crosschain/set-recipient')
export const setCurrentTxID = createAction<{ txID: string }>('crosschain/set-currentTxID')
export const setAvailableChains = createAction<{ chains: Array<CrosschainChain> }>('crosschain/set-availableChains')
export const setAvailableTokens = createAction<{ tokens: Array<CrosschainToken> }>('crosschain/set-availableTokens')
export const setTargetTokens = createAction<{ targetTokens: Array<CrosschainToken> }>('crosschain/set-targetTokens')
export const setCurrentChain = createAction<{ chain: CrosschainChain }>('crosschain/set-currentChain')
export const setTargetChain = createAction<{ chain: CrosschainChain }>('crosschain/set-target-Chain')
export const setCurrentToken = createAction<{ token: CrosschainToken }>('crosschain/set-currentToken')
export const setCurrentTokenBalance = createAction<{ balance: string }>('crosschain/set-balance')
export const setTransferAmount = createAction<{ amount: string }>('crosschain/set-transfer-amount')
export const setCrosschainFee = createAction<{ value: string }>('crosschain/set-fee')
export const setUserBalance = createAction<{ balance: string }>('crosschain/set-user-balance')
export const setCrosschainTransferStatus = createAction<{ status: ChainTransferState }>(
  'crosschain/set-transfer-status'
)
export const setCrosschainDepositConfirmed = createAction<{ confirmed: boolean }>('crosschain/set-deposit-confirmed')
export const setCrosschainSwapDetails = createAction<{ details: SwapDetails }>('crosschain/set-swap-details')
export const setPendingTransfer = createAction<{ pendingTransfer: PendingTransfer }>('crosschain/set-pending-transfer')
export const setCrosschainLastTimeSwitched = createAction<{}>('crosschain/last-time-switched')
export const setAllChainsData = createAction<{ chainsBridge: ChainbridgeConfig }>('crosschain/set-all-chains-data')
