import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, WETH, Pair } from '@zeroexchange/sdk'
import { useMemo } from 'react'
import { 
    ZERO, MOCK1, UNI, zETH, zUSDC, WAVAX, zZERO, bscZERO, WBNB, USDC, 
    USDT, WBTC, SUSHI, DAI, zUSDT, zBTC, zUNI, zSUSHI, zDAI,
    bscWBNB, bscUSDC, bscUSDT, bscBTC, bscUNI, bscSUSHI, bscBUSD, bscDAI } from '../../constants'
import { STAKING_REWARDS_INTERFACE } from '../../constants/abis/staking-rewards'
import { useActiveWeb3React } from '../../hooks'
import { NEVER_RELOAD, useMultipleContractSingleData } from '../multicall/hooks'
import { tryParseAmount } from '../swap/hooks'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'

export const STAKING_GENESIS_CHAINS = {
  [ChainId.AVALANCHE]: 1612360800,
  [ChainId.SMART_CHAIN]: 1615597200,
};

export const REWARDS_DURATION_DAYS_CHAINS = {
  [ChainId.AVALANCHE]: 45,
  [ChainId.SMART_CHAIN]: 30,
}

export const STAKING_GENESIS = 1615597200;
export const REWARDS_DURATION_DAYS = 30;

// TODO add staking rewards addresses here
export const STAKING_REWARDS_INFO: {
  [chainId in ChainId]?: {
    tokens: [Token, Token]
    stakingRewardAddress: string
  }[]
} = {
  [ChainId.MAINNET]: [
    {
      tokens: [WETH[ChainId.MAINNET], ZERO],
      stakingRewardAddress: '0x6c32Eac6Cc240d507aC88ca73183c5CcC135b09C'
    },
    {
      tokens: [USDC, ZERO],
      stakingRewardAddress: '0xdAD63CBa8c4b42255e7b7055FC48435316c55E25'
    },
    {
      tokens: [USDT, ZERO],
      stakingRewardAddress: '0xe5cFc90521477f9DeA4784Cc96f0230bFFe82108',
    },
    {
      tokens: [WBTC, ZERO],
      stakingRewardAddress: '0x3C775c9f57e614b11263441968Fac2d70673301a',
    },
    {
      tokens: [UNI[ChainId.MAINNET], ZERO],
      stakingRewardAddress: '0x8161fBcc80a2526BCf5E5207ED18b2A26dF6807D',
    },
    {
      tokens: [SUSHI, ZERO],
      stakingRewardAddress: '0xDF085d8c554018540Bbfc3123FbD8BaaC620c2Fa',
    },
    {
      tokens: [DAI, ZERO],
      stakingRewardAddress: '0x8995fcD45B13BF75f9FA65BbBC6A75066E4E9Cbf',
    },
  ],
  [ChainId.AVALANCHE]: [
    {
      tokens: [zZERO, zETH],
      stakingRewardAddress: '0x7b35150abde10F98f44DEd0d02e7E942321fbbe0'
    },
    {
      tokens: [zZERO, zUSDC],
      stakingRewardAddress: '0xfA2c38470aD0a970240cF1afD35Cd04d9e994e76'
    },
    {
      tokens: [zZERO, WAVAX],
      // old one, expires soon, to be replaced:
      stakingRewardAddress: '0x60F19487bdA9c2F8336784110dc5c4d66425402d'
      // new one:
      // stakingRewardAddress: '0x45eD4A1f9D573A6bFec9B9fDCE2954aDD62D8e77'
    },
    {
      tokens: [WAVAX, zETH],
      stakingRewardAddress: '0xD3694aeB35db0d73a4d1e83Ffe8f462E8202eD0f'
    },
    {
      tokens: [WAVAX, zUSDC],
      stakingRewardAddress: '0x8754699cf9f32B56654F7dA44fF580BdF09f3526',
    },
    { 
      tokens: [zZERO, zUSDC], 
      stakingRewardAddress: '0x617EE464d13F871FAdd6d3BE428cf452299F7a3b', 
    },
    { 
      tokens: [zZERO, zUSDT], 
      stakingRewardAddress: '0xA8AA762a6529d7A875d0195FAd8572aAd5c697bC', 
    },
    { 
      tokens: [zZERO, zBTC], 
      stakingRewardAddress: '0x1CD4C57f93784a4aba52B86a01E5d821B352BA73', 
    },
    { 
      tokens: [zZERO, zUNI], 
      stakingRewardAddress: '0xcE64d9454246e690e005AC6371aF9FeD88134425', 
    },
    { 
      tokens: [zZERO, zSUSHI], 
      stakingRewardAddress: '0x46609d1A08fAd26A52f4D84bB58523C6598352a5', 
    },
    { 
      tokens: [zZERO, zDAI], 
      stakingRewardAddress: '0xAfE2d3154bd3eC5601b610145923cb0ECA1937De', 
    },
  ],
  [ChainId.FUJI]: [
    {
      tokens: [WETH[ChainId.FUJI], MOCK1],
      stakingRewardAddress: '0x1F6271FedF344724DBd489ee4963f05AF8a0970c'
    }
  ],
  [ChainId.SMART_CHAIN]: [
    {
      tokens: [bscZERO, bscBUSD],
      stakingRewardAddress: '0x389a83ce9Da4bceeD934Bcb68c3A9Beb8A10135e',
    },
    {
      tokens: [WBNB, bscZERO],
      stakingRewardAddress: '0x4564c264ED7CC55CfAeffAF03F662c3a68602e6A',
    },
    // { 
    //   tokens: [bscZERO, bscWBNB], 
    //   stakingRewardAddress: '0x4564c264ED7CC55CfAeffAF03F662c3a68602e6A',
    // },
    { 
        tokens: [bscZERO, bscUSDC], 
        stakingRewardAddress: '0x0Ff36b5F7B87Bb61BE8305F9b47c83910560DF95',
    },
    { 
        tokens: [bscZERO, bscUSDT], 
        stakingRewardAddress: '0xacE237D2cC182E8c1E3866509b800Fe35e192108',
    },
    { 
        tokens: [bscZERO, bscBTC], 
        stakingRewardAddress: '0x9c13B95F92F4b35DC725c5d4D5e3ffa467e58091',
    },
    { 
        tokens: [bscZERO, bscUNI], 
        stakingRewardAddress: '0x300b7ae70C9a8AA3643d4b9Ac90145c8dbd5a961',
    },
    { 
        tokens: [bscZERO, bscSUSHI], 
        stakingRewardAddress: '0x8C0e0d72b29e51518034536fd509c9c1F5306B2d',
    },
    // { 
    //     tokens: [bscZERO, bscBUSD], 
    //     stakingRewardAddress: '0x389a83ce9Da4bceeD934Bcb68c3A9Beb8A10135e',
    // },
    { 
        tokens: [bscZERO, bscDAI], 
        stakingRewardAddress: '0xa8630279dBFb97a92a7C477c17FF4466b619A3d2',
    },
  ]
}

export interface StakingInfo {
  // the address of the reward contract
  stakingRewardAddress: string
  // the tokens involved in this pair
  tokens: [Token, Token]
  // the amount of token currently staked, or undefined if no account
  stakedAmount: TokenAmount
  // the amount of reward token earned by the active account, or undefined if no account
  earnedAmount: TokenAmount
  // the total amount of token staked in the contract
  totalStakedAmount: TokenAmount
  // the amount of token distributed per second to all LPs, constant
  totalRewardRate: TokenAmount
  // the current amount of token distributed to the active account per second.
  // equivalent to percent of total supply * reward rate
  rewardRate: TokenAmount
  // when the period ends
  periodFinish: Date | undefined
  // if pool is active
  active: boolean
  // calculates a hypothetical amount of token distributed to the active account per second.
  getHypotheticalRewardRate: (
    stakedAmount: TokenAmount,
    totalStakedAmount: TokenAmount,
    totalRewardRate: TokenAmount
  ) => TokenAmount
}

// gets the staking info from the network for the active chain id
export function useStakingInfo(pairToFilterBy?: Pair | null): StakingInfo[] {
  const { chainId, account } = useActiveWeb3React()

  // detect if staking is ended
  const currentBlockTimestamp = useCurrentBlockTimestamp()

  const info = useMemo(
    () =>
      chainId
        ? STAKING_REWARDS_INFO[chainId]?.filter(stakingRewardInfo =>
            pairToFilterBy === undefined
              ? true
              : pairToFilterBy === null
              ? false
              : pairToFilterBy.involvesToken(stakingRewardInfo.tokens[0]) &&
                pairToFilterBy.involvesToken(stakingRewardInfo.tokens[1])
          ) ?? []
        : [],
    [chainId, pairToFilterBy]
  )

  const uni = chainId ? UNI[chainId] : undefined

  const rewardsAddresses = useMemo(() => info.map(({ stakingRewardAddress }) => stakingRewardAddress), [info])

  const accountArg = useMemo(() => [account ?? undefined], [account])

  // get all the info from the staking rewards contracts
  const balances = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'balanceOf', accountArg)
  const earnedAmounts = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'earned', accountArg)
  const totalSupplies = useMultipleContractSingleData(rewardsAddresses, STAKING_REWARDS_INTERFACE, 'totalSupply')

  // tokens per second, constants
  const rewardRates = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'rewardRate',
    undefined,
    NEVER_RELOAD
  )
  const periodFinishes = useMultipleContractSingleData(
    rewardsAddresses,
    STAKING_REWARDS_INTERFACE,
    'periodFinish',
    undefined,
    NEVER_RELOAD
  )

  return useMemo(() => {
    if (!chainId || !uni) return []

    return rewardsAddresses.reduce<StakingInfo[]>((memo, rewardsAddress, index) => {
      // these two are dependent on account
      const balanceState = balances[index]
      const earnedAmountState = earnedAmounts[index]

      // these get fetched regardless of account
      const totalSupplyState = totalSupplies[index]
      const rewardRateState = rewardRates[index]
      const periodFinishState = periodFinishes[index]

      if (
        // these may be undefined if not logged in
        !balanceState?.loading &&
        !earnedAmountState?.loading &&
        // always need these
        totalSupplyState &&
        !totalSupplyState.loading &&
        rewardRateState &&
        !rewardRateState.loading &&
        periodFinishState &&
        !periodFinishState.loading
      ) {
        if (
          balanceState?.error ||
          earnedAmountState?.error ||
          totalSupplyState.error ||
          rewardRateState.error ||
          periodFinishState.error
        ) {
          console.error('Failed to load staking rewards info')
          return memo
        }

        // get the LP token
        const tokens = info[index].tokens
        const dummyPair = new Pair(new TokenAmount(tokens[0], '0'), new TokenAmount(tokens[1], '0'))

        // check for account, if no account set to 0

        const stakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(balanceState?.result?.[0] ?? 0))
        const totalStakedAmount = new TokenAmount(dummyPair.liquidityToken, JSBI.BigInt(totalSupplyState.result?.[0]))
        const totalRewardRate = new TokenAmount(uni, JSBI.BigInt(rewardRateState.result?.[0]))

        const getHypotheticalRewardRate = (
          stakedAmount: TokenAmount,
          totalStakedAmount: TokenAmount,
          totalRewardRate: TokenAmount
        ): TokenAmount => {
          return new TokenAmount(
            uni,
            JSBI.greaterThan(totalStakedAmount.raw, JSBI.BigInt(0))
              ? JSBI.divide(JSBI.multiply(totalRewardRate.raw, stakedAmount.raw), totalStakedAmount.raw)
              : JSBI.BigInt(0)
          )
        }

        const individualRewardRate = getHypotheticalRewardRate(stakedAmount, totalStakedAmount, totalRewardRate)

        const periodFinishSeconds = periodFinishState.result?.[0]?.toNumber()
        const periodFinishMs = periodFinishSeconds * 1000

        // compare period end timestamp vs current block timestamp (in seconds)
        const active =
          periodFinishSeconds && currentBlockTimestamp ? periodFinishSeconds > currentBlockTimestamp.toNumber() : true

        memo.push({
          stakingRewardAddress: rewardsAddress,
          tokens: info[index].tokens,
          periodFinish: periodFinishMs > 0 ? new Date(periodFinishMs) : undefined,
          earnedAmount: new TokenAmount(uni, JSBI.BigInt(earnedAmountState?.result?.[0] ?? 0)),
          rewardRate: individualRewardRate,
          totalRewardRate: totalRewardRate,
          stakedAmount: stakedAmount,
          totalStakedAmount: totalStakedAmount,
          getHypotheticalRewardRate,
          active
        })
      }
      return memo
    }, [])
  }, [
    balances,
    chainId,
    currentBlockTimestamp,
    earnedAmounts,
    info,
    periodFinishes,
    rewardRates,
    rewardsAddresses,
    totalSupplies,
    uni
  ])
}

export function useTotalUniEarned(): TokenAmount | undefined {
  const { chainId } = useActiveWeb3React()
  const uni = chainId ? UNI[chainId] : undefined
  const stakingInfos = useStakingInfo()

  return useMemo(() => {
    if (!uni) return undefined
    return (
      stakingInfos?.reduce(
        (accumulator, stakingInfo) => accumulator.add(stakingInfo.earnedAmount),
        new TokenAmount(uni, '0')
      ) ?? new TokenAmount(uni, '0')
    )
  }, [stakingInfos, uni])
}

// based on typed value
export function useDerivedStakeInfo(
  typedValue: string,
  stakingToken: Token,
  userLiquidityUnstaked: TokenAmount | undefined
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingToken)

  const parsedAmount =
    parsedInput && userLiquidityUnstaked && JSBI.lessThanOrEqual(parsedInput.raw, userLiquidityUnstaked.raw)
      ? parsedInput
      : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}

// based on typed value
export function useDerivedUnstakeInfo(
  typedValue: string,
  stakingAmount: TokenAmount
): {
  parsedAmount?: CurrencyAmount
  error?: string
} {
  const { account } = useActiveWeb3React()

  const parsedInput: CurrencyAmount | undefined = tryParseAmount(typedValue, stakingAmount.token)

  const parsedAmount = parsedInput && JSBI.lessThanOrEqual(parsedInput.raw, stakingAmount.raw) ? parsedInput : undefined

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }
  if (!parsedAmount) {
    error = error ?? 'Enter an amount'
  }

  return {
    parsedAmount,
    error
  }
}
