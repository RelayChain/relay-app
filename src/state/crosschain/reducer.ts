import {
  ChainTransferState,
  CrosschainChain,
  CrosschainToken,
  PendingTransfer,
  ProposalStatus,
  SwapDetails,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainDepositConfirmed,
  setCrosschainLastTimeSwitched,
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
  setTransferAmount,
  setAllChainsData
} from './actions'

import { createReducer } from '@reduxjs/toolkit'
import { ChainbridgeConfig } from 'constants/CrosschainConfig';

export interface CrosschainState {
  readonly currentRecipient: string
  readonly currentTxID: string
  readonly availableChains: Array<CrosschainChain>
  readonly availableTokens: Array<CrosschainToken>
  readonly currentChain: CrosschainChain
  readonly targetChain: CrosschainChain
  readonly targetTokens: Array<CrosschainToken>
  readonly currentToken: CrosschainToken
  readonly currentBalance: string
  readonly transferAmount: string
  readonly crosschainFee: string
  readonly crosschainTransferStatus: ChainTransferState
  readonly swapDetails: SwapDetails
  readonly depositConfirmed: boolean
  readonly pendingTransfer: PendingTransfer
  readonly lastTimeSwitched: number
  readonly allCrosschainData: ChainbridgeConfig
}

export const initialState: CrosschainState = {
  currentRecipient: '',
  currentTxID: '',
  availableChains: new Array<CrosschainChain>(),
  availableTokens: new Array<CrosschainToken>(),
  targetTokens: new Array<CrosschainToken>(),
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
    address: '',
    assetBase: '',
    symbol: '',
    decimals: 18,
    resourceId: ''
  },
  currentBalance: '',
  transferAmount: '',
  crosschainFee: '',
  crosschainTransferStatus: ChainTransferState.NotStarted,
  swapDetails: {
    status: ProposalStatus.INACTIVE,
    voteCount: 0
  },
  depositConfirmed: false,
  pendingTransfer: {},
  lastTimeSwitched: ~~(Date.now() / 1000),
  allCrosschainData: {} as ChainbridgeConfig
}

export default createReducer<CrosschainState>(initialState, builder =>
  builder
    .addCase(setCrosschainRecipient, (state, { payload: { address } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        currentRecipient: address
      }
    })
    .addCase(setPendingTransfer, (state, { payload: { pendingTransfer } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        pendingTransfer,
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
    .addCase(setTargetTokens, (state, { payload: { targetTokens } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        targetTokens,
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
      console.log(`For cross chain, transfer amount will be ${amount}`);
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
    .addCase(setCrosschainTransferStatus, (state, { payload: { status } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        crosschainTransferStatus: status
      }
    })
    .addCase(setCrosschainSwapDetails, (state, { payload: { details } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        swapDetails: details
      }
    })
    .addCase(setCrosschainDepositConfirmed, (state, { payload: { confirmed } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        depositConfirmed: confirmed
      }
    })
    // eslint-disable-next-line
    .addCase(setCrosschainLastTimeSwitched, (state, { }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        lastTimeSwitched: ~~(Date.now() / 1000) + 5
      }
    })
    .addCase(setAllChainsData, (state, { payload: { chainsBridge } }) => {
      const currentState = { ...initialState, ...state };
      return {
        ...currentState,
        allCrosschainData: chainsBridge
      }
    })

)
