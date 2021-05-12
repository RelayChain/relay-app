import { createReducer } from '@reduxjs/toolkit'

import { setAprData, AprObjectProps } from './actions'

export interface PoolsState {
  readonly aprData: AprObjectProps[]
}

const initialState: PoolsState = {
  aprData: []
}

export default createReducer<PoolsState>(initialState, builder =>
  builder.addCase(setAprData, (state, { payload: { aprData } }) => {
    return {
      ...state,
      aprData
    }
  })
)