import { createReducer } from '@reduxjs/toolkit'

import { setAprData, AprObjectProps, setPoolsData, setToggle, setStackingInfo } from './actions'

export interface PoolsState {
  aprData: AprObjectProps[]
  poolsData: any[]
  isTouchable: boolean
  poolStackingInfo: any[]
}

const initialState: PoolsState = {
  aprData: [],
  poolsData: [],
  isTouchable: false,
  poolStackingInfo: []
}

export default createReducer<PoolsState>(initialState, builder =>
  builder
    .addCase(setAprData, (state, { payload: { aprData } }) => {
      return {
        ...state,
        aprData
      }
    })
    .addCase(setPoolsData, (state, { payload: { poolsData } }) => {
      return {
        ...state,
        poolsData
      }
    }).addCase(setToggle, (state, { payload: { isTouchable } }) => {
      return {
        ...state,
        isTouchable
      }
    }).addCase(setStackingInfo, (state, { payload: { poolStackingInfo } }) => {
      return {
        ...state,
        poolStackingInfo
      }
    })
)
