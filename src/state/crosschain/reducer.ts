import {
  CrosschainChain,
  CrosschainToken,
  setCrosschainSwapStatus,
  setCrosschainRecipient,
  setCurrentTxID,
  setAvailableChains,
  setAvailableTokens,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setTransferAmount,
  setCrosschainFee,
  setTargetChain, setApproveStatus
} from './actions'

import { createAction, createReducer } from '@reduxjs/toolkit'

export interface CrosschainState {
  readonly swapStatus: {}
  readonly currentRecipient: string
  readonly currentTxID: string
  readonly availableChains: Array<CrosschainChain>
  readonly availableTokens: Array<CrosschainToken>
  readonly currentChain: CrosschainChain
  readonly targetChain: CrosschainChain
  readonly currentToken: CrosschainToken
  readonly currentBalance: string
  readonly transferAmount: string
  readonly crosschainFee: string
  readonly approveStatus: boolean
}

const initialState: CrosschainState = {
  swapStatus: {},
  currentRecipient: '',
  currentTxID: '',
  availableChains: new Array<CrosschainChain>(),
  availableTokens: new Array<CrosschainToken>(),
  currentChain: {
    name: '',
    chainID: '',
  },
  targetChain: {
    name: '',
    chainID: '',
  },
  currentToken: {
    name: '',
    address: ''
  },
  currentBalance: '',
  transferAmount: '',
  crosschainFee: '',
  approveStatus: false
}

export default createReducer<CrosschainState>(initialState, builder =>
  builder
    .addCase(setCrosschainSwapStatus, (state, { payload: { txID, status } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        swapStatus: {
          ...state.swapStatus,
          [txID]: status
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
    .addCase(setTargetChain, (state, { payload: { chain } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        targetChain: chain
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
        currentBalance: balance
      }
    })
    .addCase(setTransferAmount, (state, { payload: { amount } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        transferAmount: amount
      }
    })
    .addCase(setCrosschainFee, (state, { payload: { value } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        crosschainFee: value
      }
    })
    .addCase(setApproveStatus, (state, { payload: { confirmed } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        approveStatus: confirmed
      }
    })
)
