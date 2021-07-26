import { ChainId, Currency, CurrencyAmount, JSBI, Token, TokenAmount, ETHER_CURRENCIES } from '@zeroexchange/sdk'
import { useMultipleContractSingleData, useSingleContractMultipleData } from '../multicall/hooks'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { UNI } from './../../constants/index'
import { isAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useAllCrossChainTokens, useAllTokens } from '../../hooks/Tokens'
import { useMemo } from 'react'
import { useMulticallContract } from '../../hooks/useContract'
import { useTotalUniEarned } from '../stake/hooks'
import { useUserUnclaimedAmount } from '../claim/hooks'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */

export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: ChainId
): { [address: string]: CurrencyAmount | undefined } {
  const multicallContract = useMulticallContract()

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
          .map(isAddress)
          .filter((a): a is string => a !== false)
          .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address])
  )

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()), chainId)
        return memo
      }, {}),
    [addresses, results, chainId]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address])

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = new TokenAmount(token, amount)
            }
            return memo
          }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalancesWithSortBalances(isAscendingFilter: boolean 
): [{ [tokenAddress: string]: TokenAmount }] {
  const { account } = useActiveWeb3React()
  const allTokens = useAllCrossChainTokens()

  const tokens = useMemo(() => Object.values(allTokens ?? {}), [allTokens])

  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => {
    return { address: vt.address, decimals: vt.decimals }
  }), [validatedTokens])
  const listAddressesTokens = validatedTokenAddresses.map(i => i.address)
  const balances = useMultipleContractSingleData(listAddressesTokens, ERC20_INTERFACE, 'balanceOf', [String(account)])

  const tokenWithBalance = validatedTokenAddresses.map((token, i) => {
    return {
      address: token.address, balance: JSBI.exponentiate(JSBI.BigInt((balances[i]?.result?.balance) ? balances[i]?.result?.balance : 0),
        JSBI.BigInt(token.decimals)), decimals: token.decimals
    }
  })
  return [
    useMemo(
      () => {
        const filterA = isAscendingFilter ? -1 : 1
        const filterB = isAscendingFilter ? 1 : -1
        const sortedTokens = (validatedTokens.length > 0)

          ? validatedTokens.sort((a, b) => {
            const valueA = tokenWithBalance.find(item => item.address === a.address)
            const valueB = tokenWithBalance.find(item => item.address === b.address)
            const amountA = valueA?.balance ? valueA.balance : undefined
            const amountB = valueB?.balance ? valueB.balance : undefined
            return amountA && amountB ? JSBI.greaterThan(amountA, amountB) ? filterA : filterB : 0

          }) : []
        const sortedTokensWithBalances = sortedTokens.reduce<{ [tokenAddress: string]: TokenAmount }>((memo, token, i) => {
          const value = balances?.[i]?.result?.[0]
          const amount = value ? JSBI.BigInt(value.toString()) : undefined
          if (amount) {
            memo[token.address] = new TokenAmount(token, amount)
          }
          return memo
        }, {})
        return sortedTokensWithBalances
      },
      // eslint-disable-next-line 
      [account, validatedTokens, balances]
    )
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
  chainId?: ChainId | undefined
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens)
  // const containsETH: boolean = useMemo(() => currencies ?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(account ? [account] : [], chainId)
  // const ethBalance = useETHBalances(account ? [account] : []) ?.[account ?? '']

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (ETHER_CURRENCIES.includes(currency)) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency,
  chainId?: ChainId
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency], chainId)[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}

// get the total owned, unclaimed, and unharvested UNI for account
export function useAggregateUniBalance(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React()

  const uni = chainId ? UNI[chainId] : undefined

  const uniBalance: TokenAmount | undefined = useTokenBalance(account ?? undefined, uni)
  const uniUnclaimed: TokenAmount | undefined = useUserUnclaimedAmount(account)
  const uniUnHarvested: TokenAmount | undefined = useTotalUniEarned()

  if (!uni) return undefined

  return new TokenAmount(
    uni,
    JSBI.add(
      JSBI.add(uniBalance?.raw ?? JSBI.BigInt(0), uniUnclaimed?.raw ?? JSBI.BigInt(0)),
      uniUnHarvested?.raw ?? JSBI.BigInt(0)
    )
  )
}
