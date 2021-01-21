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
}

export const setCrosschainSwapStatus = createAction<{ txID: string, status: ProposalStatus }>('crosschain/set-swaps-tatus')
export const setCrosschainRecipient = createAction<{ address: string }>('crosschain/set-recipient')
export const setCurrentTxID = createAction<{ txID: string }>('crosschain/set-currentTxID')
export const setAvailableChains = createAction<{ chains: Array<CrosschainChain> }>('crosschain/set-availableChains')
export const setAvailableTokens = createAction<{ tokens: Array<CrosschainToken> }>('crosschain/set-availableTokens')
export const setCurrentChain = createAction<{ chain: CrosschainChain }>('crosschain/set-currentChain')
export const setCurrentToken = createAction<{ token: CrosschainToken }>('crosschain/set-currentToken')