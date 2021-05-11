import { arrayMove } from './arrayMove'

const defaultOptions = [
  {
    label: 'Hot'
  },
  {
    label: 'APR'
  },
  {
    label: 'Earned'
  },
  {
    label: 'Liquidity'
  }
]

export const setOptions = (str: string) => {
  switch (str) {
    case 'Liquidity':
      return arrayMove(defaultOptions, 3, 0)
    case 'Hot':
      return defaultOptions
    case 'APR':
      return arrayMove(defaultOptions, 1, 0)
    case 'Earned':
        return arrayMove(defaultOptions, 2, 0)
    default:
      return defaultOptions
  }
}

export const sortPoolsItems = (str: string, array: any, readyForHarvest: any, totalLiquidity: any) => {
  switch (str) {
    case 'Earned':
      return array.sort((a: any, b: any) => {
        const aVal = parseFloat(readyForHarvest[a.stakingRewardAddress]) || 0
        const bVal = parseFloat(readyForHarvest[b.stakingRewardAddress]) || 0
        return bVal - aVal
      })
    case 'Liquidity':
      return array.sort((a: any, b: any) => {
        const aVal = parseFloat(totalLiquidity[a.stakingRewardAddress]) || 0
        const bVal = parseFloat(totalLiquidity[b.stakingRewardAddress]) || 0
        return bVal - aVal
      })
    case 'APR':
      return array.sort((a: any, b: any) => {
        return (b.APR || 0) - (a.APR || 0)
      })
    default:
      return array
  }
}
