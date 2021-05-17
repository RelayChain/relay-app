import { arrayMove } from './arrayMove'
import { ChainId } from '@zeroexchange/sdk'
import { unwrappedToken } from './wrappedCurrency'
import { StakingInfo } from 'state/stake/hooks'

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

export const sortPoolsItems = (array: any[], str: string, readyForHarvest: any, totalLiquidity: any) => {
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

export const searchItems = (array: any[], searchText: string, chainId?: ChainId) => {
  if (!searchText || searchText.length === 0 || searchText === '' || searchText.trim().length === 0) {
    return array
  }
  return array.map(item => {
    if (item) {
      const firstCurrencySymbol = unwrappedToken(item.tokens[0], chainId).symbol
      const secondCurrencySymbol = unwrappedToken(item.tokens[1], chainId).symbol

      if (firstCurrencySymbol && secondCurrencySymbol) {
        if (
          firstCurrencySymbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1 ||
          secondCurrencySymbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1
        ) {
          return item
        }
      } else {
        return { ...item, isHidden: true }
      }
    } else return item
  })
}


export const showStakedItems = (array: any[], showStaked: any, readyForHarvest: any) => {
  if (showStaked) {
    return (array = array.map(item => {
      if (readyForHarvest[item.stakingRewardAddress] !== undefined && Boolean(item?.stakedAmount?.greaterThan('0'))) {
        return item
      } else {
        return { ...item, isHidden: true }
      }
    }))
  } else {
    return array
      .sort((a, b) => parseFloat(b?.stakedAmount?.toSignificant(6)) - parseFloat(a?.stakedAmount?.toSignificant(6)))
      .sort(
        (a, b) =>
          parseFloat(readyForHarvest[b?.stakingRewardAddress]) - parseFloat(readyForHarvest[a?.stakingRewardAddress])
      )
  }
}

export const showLiveOrFinishedItems = (stakingInfos: StakingInfo[], showLive: any) => {
  const stakingInfosWithBalance = stakingInfos.filter(item => item.active)
  const finishedPools = stakingInfos.filter(item => !item.active)

  // live or finished pools?
  if (showLive && stakingInfosWithBalance && stakingInfosWithBalance.length > 0) {
    return stakingInfos.map(item => (item.active ? item : { ...item, isHidden: true }))
  } else if (!showLive && finishedPools && finishedPools.length > 0) {
    return stakingInfos.map(item => (!item.active ? item : { ...item, isHidden: true }))
  } else return stakingInfos
}

export const filterPoolsItems = (
  stakingInfos: StakingInfo[],
  showLive: any,
  showStaked: any,
  readyForHarvest: any,
  filteredMode: any,
  // searchText: any,
  // chainId: any,
  totalLiquidity: any
) => {
  let sortedArray: any[] = []
  sortedArray = showLiveOrFinishedItems(stakingInfos, showLive)

  sortedArray = showStakedItems(sortedArray, showStaked, readyForHarvest)

  sortedArray = sortPoolsItems(sortedArray, filteredMode, readyForHarvest, totalLiquidity)

  // sortedArray = searchItems(sortedArray, searchText, chainId)
  return sortedArray
}
