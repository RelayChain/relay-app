import { ChainId, Token } from '@zeroexchange/sdk'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
import { UNSUPPORTED_LIST_URLS } from './../../constants/lists'
import { toCheckSumAddress } from '../../state/crosschain/hooks'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }> }>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {},
  [ChainId.FUJI]: {
    '0xD752858feafADd6BD6B92e5bBDbb3DC8d40cD351': new WrappedTokenInfo(
      {
        chainId: ChainId.FUJI,
        address: '0xD752858feafADd6BD6B92e5bBDbb3DC8d40cD351',
        name: 'Mock 1',
        decimals: 18,
        symbol: 'MCK1'
      },
      []
    ),
    '0x5300A4834F1995828B99bE23bcD99C80002DE9c8': new WrappedTokenInfo(
      {
        chainId: ChainId.FUJI,
        address: '0x5300A4834F1995828B99bE23bcD99C80002DE9c8',
        name: 'Mock 2',
        decimals: 18,
        symbol: 'MCK2'
      },
      []
    )
  },
  [ChainId.AVALANCHE]: {
    '0xD752858feafADd6BD6B92e5bBDbb3DC8d40cD351': new WrappedTokenInfo(
      {
        chainId: ChainId.FUJI,
        address: '0xD752858feafADd6BD6B92e5bBDbb3DC8d40cD351',
        name: 'Mock 1',
        decimals: 18,
        symbol: 'MCK1'
      },
      []
    ),
    '0x5300A4834F1995828B99bE23bcD99C80002DE9c8': new WrappedTokenInfo(
      {
        chainId: ChainId.FUJI,
        address: '0x5300A4834F1995828B99bE23bcD99C80002DE9c8',
        name: 'Mock 2',
        decimals: 18,
        symbol: 'MCK2'
      },
      []
    )
  },
  [ChainId.SMART_CHAIN]: {},
  [ChainId.SMART_CHAIN_TEST]: {},
  [ChainId.MOONBASE_ALPHA]: {},
  [ChainId.MUMBAI]: {},
  [ChainId.MATIC]: {},
  [ChainId.HECO]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map(tagId => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const address = toCheckSumAddress(tokenInfo?.address)
      const tokenData = { ...tokenInfo, address }
      const token = new WrappedTokenInfo(tokenData, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

export function useTokenList(url: string[] | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url[0]]?.current
    if (!current) return EMPTY_LIST
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
}

// returns all downloaded current lists
export function useAllLists(): TokenList[] {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  return useMemo(
    () =>
      Object.keys(lists)
        .map(url => lists[url].current)
        .filter((l): l is TokenList => Boolean(l)),
    [lists]
  )
}

