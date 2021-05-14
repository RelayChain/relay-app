import { createAction } from '@reduxjs/toolkit'

export type AprObjectProps = {
  APY: number
  name: String
  chain: String
  contract_addr: String
}

export const setAprData = createAction<{ aprData: AprObjectProps[] }>('pools/setAprData') //apr data api 
export const setPoolsData = createAction<{ poolsData: any[] }>('pools/setPoolsData') // arrayToShow
export const setToggle = createAction<{ isTouchable: boolean }>('pools/setToggle') // isTouchable
export const setStackingInfo = createAction<{ poolStackingInfo: any[] }>('pools/setStackingInfo') // stackingInfo