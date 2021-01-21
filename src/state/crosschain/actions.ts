import { createAction } from '@reduxjs/toolkit'

export enum ProposalStatus {
  NONE = 'None',
  INACTIVE = 'Inactive',
  ACTIVE = 'Active',
  PASSED = 'Passed',
  EXECUTED = 'Executed',
  CANCELLED = 'Cancelled',
}

export interface CrosschainToken {
  name: string,
  address: string,
}

export interface CrosschainChain {
  name: string,
  chainID: string,
  symbol?: string;
  imageUri?: string;
  resourceId?: string;
  isNativeWrappedToken?: boolean;
}

export const setCrosschainSwapStatus = createAction<{ txID: string, status: ProposalStatus }>('crosschain/set-swaps-tatus')
export const setCrosschainRecipient = createAction<{ address: string }>('crosschain/set-recipient')
export const setCurrentTxID = createAction<{ txID: string }>('crosschain/set-currentTxID')
export const setAvailableChains = createAction<{ chains: Array<CrosschainChain> }>('crosschain/set-availableChains')
export const setAvailableTokens = createAction<{ tokens: Array<CrosschainToken> }>('crosschain/set-availableTokens')
export const setCurrentChain = createAction<{ chain: CrosschainChain }>('crosschain/set-currentChain')
export const setTargetChain = createAction<{ chain: CrosschainChain }>('crosschain/set-target-Chain')
export const setCurrentToken = createAction<{ token: CrosschainToken }>('crosschain/set-currentToken')
export const setCurrentTokenBalance = createAction<{ balance: string }>('crosschain/set-balance')
export const setTransferAmount = createAction<{ amount: string }>('crosschain/set-transfer-amount')
export const setCrosschainFee = createAction<{ value: string }>('crosschain/set-fee')