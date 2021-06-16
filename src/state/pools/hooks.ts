import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { AVAX, BNB, DEV, ETHER, JSBI, MATIC, TokenAmount, ETHER_CURRENCIES } from '@zeroexchange/sdk'
import { BIG_INT_SECONDS_IN_WEEK } from '../../constants'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useColor } from '../../hooks/useColor'
import { useCurrency } from '../../hooks/Tokens'
import { usePair } from '../../data/Reserves'
import usePrevious from '../../hooks/usePrevious'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useTotalSupply } from '../../data/TotalSupply'
import useUSDCPrice from '../../utils/useUSDCPrice'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from 'hooks'
import { useStakingInfo } from 'state/stake/hooks'
import { useEffect } from 'react'
import { replacePoolsState } from './actions'

export function usePoolsState(): AppState['pools'] {
  return useSelector<AppState, AppState['pools']>(state => state.pools)
}

export function useStakingInfoTop(
  stakingInfoTop: any
): {
  countUpAmount: any
  isStaking: any
  backgroundColor: any
  currency0: any
  currency1: any
  stakingInfo: any
  valueOfTotalStakedAmountInUSDC: any
  stakingRewardAddress: any
  valueOfTotalStakedAmountInWETH: any
  countUpAmountPrevious: any
  symbol: any
} {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { weeklyEarnings, readyForHarvest, totalLiquidity } = usePoolsState()

  const harvestSent = readyForHarvest[stakingInfoTop.stakingRewardAddress]
  const earningsSent = weeklyEarnings[stakingInfoTop.stakingRewardAddress]
  const liquiditySent = totalLiquidity[stakingInfoTop.stakingRewardAddress]

  const token0 = stakingInfoTop.tokens[0]
  const token1 = stakingInfoTop.tokens[1]

  const currency0 = unwrappedToken(token0, chainId)
  const currency1 = unwrappedToken(token1, chainId)

  // get currencies and pair
  const [currencyA, currencyB] = [useCurrency(currencyId(currency0)), useCurrency(currencyId(currency1))]

  const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
  const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

  const isSingleSided = tokenA?.address !== tokenB?.address;

  const [, stakingTokenPair] = usePair(tokenA, tokenB)
  // TODO: don't we receive it as argument already?
  // const baseStakingInfo = useStakingInfo(stakingTokenPair)
  // const stakingInfo = baseStakingInfo.find(x => x.stakingRewardAddress === stakingInfoTop.stakingRewardAddress)
  const stakingInfo = stakingInfoTop;
  const stakingRewardAddress = stakingInfoTop.stakingRewardAddress
  const isStaking = Boolean(stakingInfo?.stakedAmount?.greaterThan('0'))

  // TODO: what happens if neither of tokens is ETHER?
  const [token, WETH] =
      currencyA && ETHER_CURRENCIES.includes(currencyA)
      ? [tokenB, tokenA]
      : [tokenA, tokenB]
  const backgroundColor = useColor(token)

  // get WETH value of staked LP tokens
  const totalSupplyOfStakingToken = useTotalSupply(stakingInfo?.stakedAmount?.token)
  let valueOfTotalStakedAmountInWETH: TokenAmount | undefined
  if ( isSingleSided && totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && WETH) {
    // take the total amount of LP tokens staked, multiply by ETH value of all LP tokens, divide by all LP tokens
    valueOfTotalStakedAmountInWETH = new TokenAmount(
      WETH,
      JSBI.divide(
        JSBI.multiply(
          JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WETH).raw),
          JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WETH they entitle owner to
        ),
        totalSupplyOfStakingToken.raw
      )
    )
    console.log('valueOfTotalStakedAmountInWETH :>> ', valueOfTotalStakedAmountInWETH);
  }

  // TODO: how does it work in chains other than Eth?
  // get the USD value of staked WETH
  const USDPrice = useUSDCPrice(WETH)
  const valueOfTotalStakedAmountInUSDC =
    valueOfTotalStakedAmountInWETH && USDPrice?.quote(valueOfTotalStakedAmountInWETH)

  const symbol = WETH?.symbol

  const countUpAmount =
    stakingInfo?.earnedAmount?.toFixed(Math.min(6, stakingInfo?.earnedAmount?.currency.decimals)) ?? '0'
  const countUpAmountPrevious = usePrevious(countUpAmount) ?? '0'

  useEffect(() => {
    const contract = stakingInfo?.stakingRewardAddress
    const singleWeeklyEarnings = stakingInfo?.active
      ? stakingInfo?.rewardRate
          ?.multiply(BIG_INT_SECONDS_IN_WEEK)
          ?.toSignificant(Math.min(4, stakingInfo?.earnedAmount?.currency.decimals), { groupSeparator: ',' }) ?? '-'
      : '0'
    const readyToHarvest = countUpAmount
    const liquidityValue = valueOfTotalStakedAmountInUSDC
      ? `${valueOfTotalStakedAmountInUSDC.toFixed(0)}`
      : `${valueOfTotalStakedAmountInWETH?.toSignificant(4)}`

    // this prevents infinite loops / re-renders
    if (harvestSent === readyToHarvest && earningsSent === singleWeeklyEarnings && liquiditySent === liquidityValue) {
      return
    }

    if (
      parseFloat(singleWeeklyEarnings) !== 0 &&
      parseFloat(readyToHarvest) !== 0 &&
      parseFloat(liquidityValue) !== 0
    ) {
      dispatch(
        replacePoolsState({
          singleWeeklyEarnings,
          readyToHarvest,
          liquidityValue,
          contract
        })
      )
    }
  }, [
    countUpAmount,
    stakingInfo,
    harvestSent,
    earningsSent,
    liquiditySent,
    valueOfTotalStakedAmountInUSDC,
    valueOfTotalStakedAmountInWETH
  ])
  return {
    countUpAmount,
    isStaking,
    backgroundColor,
    currency0,
    currency1,
    stakingInfo,
    valueOfTotalStakedAmountInUSDC,
    stakingRewardAddress,
    valueOfTotalStakedAmountInWETH,
    countUpAmountPrevious,
    symbol
  }
}
