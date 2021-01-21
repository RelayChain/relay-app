import {
  CrosschainChain,
  CrosschainToken,
  ProposalStatus,
  setCrosschainSwapStatus,
  setCrosschainRecipient,
  setCurrentTxID,
  setAvailableChains,
  setAvailableTokens,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
} from './actions'

import { createReducer } from '@reduxjs/toolkit'

export interface CrosschainState {
  readonly status: Map<string, ProposalStatus>
  readonly currentRecipient: string
  readonly currentTxID: string
  readonly availableChains: Array<CrosschainChain>
  readonly availableTokens: Array<CrosschainToken>
  readonly currentChain: CrosschainChain
  readonly currentToken: CrosschainToken
  readonly balance: string
}

const initialState: CrosschainState = {
  status: new Map<string, ProposalStatus>(),
  currentRecipient: '',
  currentTxID: '',
  availableChains: new Array<CrosschainChain>(),
  availableTokens: new Array<CrosschainToken>(),
  currentChain: {
    name: '',
    chainID: '',
  },
  currentToken: {
    name: '',
    address: ''
  },
  balance: '',
}

export default createReducer<CrosschainState>(initialState, builder =>
  builder
    .addCase(setCrosschainSwapStatus, (state, { payload: { txID, status } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        status: {
          ...state.status,
          txID: status
        }
      }
    })
    .addCase(setCrosschainRecipient, (state, { payload: { address } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currentRecipient: address
      }
    })
    .addCase(setCurrentTxID, (state, { payload: { txID } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currentTxID: txID
      }
    })
    .addCase(setAvailableChains, (state, { payload: { chains } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        availableChains: chains
      }
    })
    .addCase(setAvailableTokens, (state, { payload: { tokens } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        availableTokens: tokens
      }
    })
    .addCase(setCurrentChain, (state, { payload: { chain } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currentChain: chain
      }
    })
    .addCase(setCurrentToken, (state, { payload: { token } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currentToken: token
      }
    })
    .addCase(setCurrentTokenBalance, (state, { payload: { balance } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        balance: balance
      }
    })
)
