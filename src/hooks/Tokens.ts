import { Currency, Token, ETHER_NAMES_CURRENCIES, ETHER_CURRENCIES, currencyEquals } from '@zeroexchange/sdk'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { useBytes32TokenContract, useTokenContract } from './useContract'

import { isAddress } from '../utils'
import { parseBytes32String } from '@ethersproject/strings'
import { useActiveWeb3React } from './index'
import { useMemo } from 'react'
import { useUserAddedTokens } from '../state/user/hooks'
import { useCrosschainState } from 'state/crosschain/hooks'

export function useAllCrossChainTokens() {
  const { availableTokens } = useCrosschainState()
  const { chainId } = useActiveWeb3React()
  const userTokens = useUserAddedTokens()
    ?.filter((x: any) => x.chainId === chainId)
    ?.map((x: any) => {
      return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name, x.resourceId)
    })
  return availableTokens
    .map((x: any) => {
      return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name, x.resourceId)
    })
    .concat(userTokens)
}
export function useAllTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  const userAddedTokens = useUserAddedTokens()

  return useMemo(() => {
    if (!chainId) return {}
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          {}
        )
    )
  }, [chainId, userAddedTokens])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency): boolean {
  const userAddedTokens = useUserAddedTokens()
  return !!userAddedTokens.find(token => currencyEquals(currency, token))
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/
function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : bytes32 && BYTES32_REGEX.test(bytes32)
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string, nameToken?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()
  const tokenByName = useAllCrossChainTokens().find(token => token.name === nameToken)
  return tokenByName;
}

export function useCurrency(currencyId: string | undefined, tokenName?: string): Currency | null | undefined {
  const isNativeCurrency = ETHER_NAMES_CURRENCIES.includes(String(tokenName?.toUpperCase()))
  return useToken(isNativeCurrency ? undefined : currencyId, tokenName)
}
