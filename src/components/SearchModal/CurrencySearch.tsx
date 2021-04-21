import { ChainId, Currency, ETHER, Token } from '@zeroexchange/sdk'
import { CloseIcon, LinkStyledButton, TYPE } from '../../theme'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import Row, { RowBetween } from '../Row'
import { useAllTokens, useToken } from '../../hooks/Tokens'

import AutoSizer from 'react-virtualized-auto-sizer'
import Card from '../Card'
import Column from '../Column'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { DEFAULT_TOKEN_LIST as DEFAULT_TOKEN_LIST_MAINNET } from '../../constants/DefaultTokenList'
import { DEFAULT_TOKEN_LIST as DEFAULT_TOKEN_LIST_TESTNET } from '../../constants/DefaultTokenListTestnet'
import { FixedSizeList } from 'react-window'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import SortButton from './SortButton'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { filterTokens } from './filtering'
import { isAddress } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useCrosschainState } from '../../state/crosschain/hooks'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { useTokenComparator } from './sorting'
import { useTranslation } from 'react-i18next'
import { useUserAddedTokens } from '../../state/user/hooks'

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  onChangeList: () => void
  isCrossChain?: boolean
}

const DEFAULT_TOKEN_LIST = process.env.REACT_APP_TESTNET ? DEFAULT_TOKEN_LIST_TESTNET : DEFAULT_TOKEN_LIST_MAINNET

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList,
  isCrossChain
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const userAddedTokens = useUserAddedTokens()
  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)
  const allTokens = useAllTokens()
  console.log(allTokens)

  // cross chain
  const { availableTokens } = useCrosschainState()
  // ChainId.RINKEBY BUSD
  const availableTokensArray = isCrossChain
    ? availableTokens
        .filter(a => a.name !== 'BUSD')
        .map((x: any) => {
          return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
        })
    : availableTokens.map((x: any) => {
        return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
      })

  const defaultTokenList = DEFAULT_TOKEN_LIST.filter((x: any) => x.chainId === chainId).map((x: any) => {
    return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
  })

  useEffect(() => {
    if (isAddressSearch) {
    }
  }, [isAddressSearch])

  // const showETH: boolean = useMemo(() => {
  //   const s = searchQuery.toLowerCase().trim()
  //   return s === '' || s === 'e' || s === 'et' || s === 'eth' || s.includes('ava')
  // }, [searchQuery])

  const showETH = true

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(
      chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
        ? [...defaultTokenList, ...Object.values(allTokens), ...userAddedTokens]
        : [...availableTokensArray, ...Object.values(allTokens), ...userAddedTokens],
      searchQuery
    )
  }, [isAddressSearch, searchToken, searchQuery, defaultTokenList, chainId, availableTokensArray])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(s => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter(token => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter(token => token.symbol?.toLowerCase() !== symbolMatch[0])
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )
  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )

  const selectedListInfo = useSelectedListInfo()

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            Select a token
            {!isCrossChain && (
              <QuestionHelper text="Find a token by searching for its name or symbol or by pasting its address below." />
            )}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        {!isCrossChain && (
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder={t('tokenSearchPlaceholder')}
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        )}
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
        <RowBetween>
          <Text fontSize={14} fontWeight={500}>
            {!isCrossChain ? 'Token Name' : 'Available Cross-Chain Tokens'}
          </Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder(iso => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <Separator />
      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CurrencyList
              height={height}
              showETH={isCrossChain ? false : showETH}
              currencies={!isCrossChain ? filteredSortedTokens : availableTokensArray}
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
              searchQuery={searchQuery}
            />
          )}
        </AutoSizer>
      </div>

      <Separator />
      <Card>
        <RowBetween>
          <LinkStyledButton
            style={{ fontWeight: 500, color: theme.text2, fontSize: 16 }}
            onClick={onChangeList}
            id="currency-search-change-list-button"
          >
            Manage Lists
          </LinkStyledButton>
        </RowBetween>
      </Card>
    </Column>
  )
}
