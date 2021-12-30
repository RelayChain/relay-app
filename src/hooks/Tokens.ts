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
  const address = useMemo(() => {
    return isAddress(tokenAddress)
  }, [tokenAddress]);

  const tokenContract = useTokenContract(address ? address : undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)
  const token: Token | undefined = tokenByName ? tokenByName : address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(token ? undefined : tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token'),
        tokenByName ? tokenByName.resourceId : ''
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
    tokenByName
  ])
}

export function useCurrency(currencyId: string | undefined, tokenName?: string): Currency | null | undefined {
  const isNativeCurrency = ETHER_NAMES_CURRENCIES.includes(String(currencyId?.toUpperCase()))
  const token = useToken(isNativeCurrency ? undefined : currencyId, tokenName)

  if (isNativeCurrency) {
    return ETHER_CURRENCIES.find((curr: Currency) => curr.symbol === String(currencyId?.toUpperCase()))
  }
  else {
    return token
  }
}
