import { createAction } from '@reduxjs/toolkit'

export type AprObjectProps = {
  APY: number
  name: String
  chain: String
  contract_addr: String
}

export const setAprData = createAction<{ aprData: AprObjectProps[] }>('pools/setAprData') //apr data api 
export const setPoolsData = createAction<{ poolsData: any[] }>('pools/setPoolsData') 
export const setToggle = createAction<{ isTouchable: boolean }>('pools/setToggle') 
export const setStackinInfo = createAction<{ poolStackingInfo: any[] }>('pools/setStackinInfo') 