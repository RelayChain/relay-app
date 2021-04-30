type ZeroDayData = {
  totalLiquidityUSD: string
  dailyVolumeUSD: string
  date: number
}

export type TVLHistoryData = {
  TVL_total_usd: number
  date: string
}

export type LiquidityVolumeList = {
  zeroDayDatas: ZeroDayData[]
}

export type Transaction = {
  __typename: string
  id: string
  timestamp: string
}

export type Token = {
  __typename: string
  id: string
  symbol: string
}

export type Pair = {
  __typename: string
  token0: Token
  token1: Token
}

export type TransactionType = {
  pair: Pair
  transaction: Transaction
  to: string
  liquidity: string
  amount0: string
  amount0In?: string
  amount0Out?: string
  amount1: string
  amount1In?: string
  amount1Out?: string
  amountUSD: srring
}

export type TransactionTypes = {
  mints: TransactionType[]
  burns: TransactionType[]
  swaps: TransactionType[]
}
