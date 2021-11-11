import { Box, Flex, Text } from 'rebass'
import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import { ExternalLink, LinkStyledButton, TYPE } from '../../theme'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRemoveUserAddedToken, useUserAddedTokens } from '../../state/user/hooks'

import { ArrowRight as Arrow } from './../Arrows'
import AutoSizer from 'react-virtualized-auto-sizer'
import Card from '../Card'
import { CloseIcon } from '../../theme'
import Column from '../Column'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { FixedSizeList } from 'react-window'
import { Info } from 'react-feather'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'
import SortButton from './SortButton'
import { ThemeContext } from 'styled-components'
import Toggle from './../Toggle'
import { checksumedCoingeckoList } from 'constants/coingecko'
import { filterTokens } from './filtering'
import { isAddress } from '../../utils'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCrosschainState } from '../../state/crosschain/hooks'
import useDebounce from 'hooks/useDebounce'
import { useIsMountedRef } from 'state/swap/hooks'
import { useToken } from '../../hooks/Tokens'
import { useTokenComparator } from './sorting'
import { useTranslation } from 'react-i18next'

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

const RowCenter = styled(RowBetween)`
  justify-content: center;
`

const ArrowLeft = styled.div`
  transform: rotate(180deg);
  cursor: pointer;
`

const MarginWrap = styled.div`
  margin-top: 20px;
`

const TokenListRow = styled.div`
  padding: 20px;
  background: rgba(18, 21, 56, 0.54);
  border-radius: 22px;
`


// const DEFAULT_TOKEN_LIST = process.env.REACT_APP_TESTNET ? DEFAULT_TOKEN_LIST_TESTNET : DEFAULT_TOKEN_LIST_MAINNET

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  onChangeList,
  isCrossChain,
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const isEthChain = chainId === 1
  const theme = useContext(ThemeContext)

  const [isManageTokenList, setIsManageTokenList] = useState<boolean>(false)
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const [isManageLists, setManageListsToggle] = useState<boolean>(true)
  const [isCoingeckoListOn, showCoinGeckoList] = useState<boolean>(false)
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(true)


  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const isMountedRef = useIsMountedRef()
  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  // cross chain
  const { availableTokens } = useCrosschainState()
  const userTokens = useUserAddedTokens()
    ?.filter((x: any) => x.chainId === chainId)
    ?.map((x: any) => {
      return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
    })

  // const defaultTokenList = DEFAULT_TOKEN_LIST.filter((x: any) => x.chainId === chainId)
  //   .map((x: any) => {
  //     return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
  //   })
  //   .concat(userTokens)

    let availableTokensArray = useMemo(() => {
      return isCrossChain
        ? availableTokens
            .filter(a => a.name !== 'BUSD')
            .filter(y => !y.disableTransfer)
            .map((x: any) => {
              return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
            }).concat(userTokens)
        : isCoingeckoListOn && isEthChain
        ? [...availableTokens, ...checksumedCoingeckoList]
            .map((x: any) => {
              return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
            })
            .concat(userTokens)
        : availableTokens
            .map((x: any) => {
              return new Token(x.chainId, x.address, x.decimals, x.symbol, x.name)
            })
            .concat(userTokens)
            // eslint-disable-next-line
    }, [isCrossChain, availableTokens, isCoingeckoListOn, checksumedCoingeckoList])

    if (isCoingeckoListOn && checksumedCoingeckoList && availableTokens && availableTokensArray) {
      for (let i = availableTokens.length, j = 0; i < availableTokensArray.length - (userTokens.length ?? 0); i++) {
        if (
          availableTokensArray[i] &&
          !availableTokensArray[i].hasOwnProperty('logoURI') &&
          checksumedCoingeckoList[j] &&
          checksumedCoingeckoList[j].hasOwnProperty('logoURI')
        ) {
          availableTokensArray[i]['logoURI'] = checksumedCoingeckoList[j]['logoURI']
        }
        j++
      }
    }

    let uniqueAvailableTokensArray = availableTokensArray.filter(
      (elem, index) => availableTokensArray.findIndex(obj => obj.address === elem.address) === index
    )


  // const showETH: boolean = useMemo(() => {
  //   const s = searchQuery.toLowerCase().trim()
  //   return s === '' || s === 'e' || s === 'et' || s === 'eth' || s.includes('ava')
  // }, [searchQuery])

  const showETH = true

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []

    // the search list should only show by default tokens that are in our pools
    return filterTokens([...uniqueAvailableTokensArray], debouncedQuery)

    // return filterTokens(
    //   chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
    //     ? [...Object.values(allTokens)]
    //     : [...uniqueAvailableTokensArray, ...Object.values(allTokens)],
    //   searchQuery
    // )
    // eslint-disable-next-line
  }, [isAddressSearch, searchToken, debouncedQuery, chainId, uniqueAvailableTokensArray])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = debouncedQuery
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
    // eslint-disable-next-line
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])



  const [arrayToShow, setArrayToShow] = useState<Token[]>(
    filteredSortedTokens.length > 40 ? filteredSortedTokens.slice(0, 40) : filteredSortedTokens
  )

  useEffect(() => {
    if (isMountedRef && isCoingeckoListOn) {
      setArrayToShow(filteredSortedTokens.length > 40 ? filteredSortedTokens.slice(0, 40) : filteredSortedTokens)
    }
    // eslint-disable-next-line
  }, [isCoingeckoListOn, debouncedQuery, invertSearchOrder])

  const loadMore = (startIndex: any, stopIndex: any) => {
    return new Promise(resolve => {
      setTimeout(() => {
        let arr = filteredSortedTokens.slice(arrayToShow.length, stopIndex + 10)
        setArrayToShow([...arrayToShow, ...arr])
        resolve('')
      }, 0)
    })
  }

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
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  )

  interface ManageListProps {
    setIsManageTokenList: (value: boolean) => void
    tokenLength: number
  }

  const ManageList = ({ setIsManageTokenList, tokenLength }: ManageListProps) => {
    const removeToken = useRemoveUserAddedToken()
    const removeAllTokens = () => {
      userTokens.forEach(item => {
        if (chainId && item instanceof Token) removeToken(chainId, item.address)
      })
    }

    return (
      <Column style={{ width: '100%', flex: '1 1' }}>
        <RowBetween>
          <ArrowLeft onClick={() => setIsManageTokenList(!isManageTokenList)}>
            <Arrow />
          </ArrowLeft>
          <h3>Manage</h3>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <Separator />
        <MarginWrap>
          <Toggle
            isActive={isManageLists}
            toggle={() => setManageListsToggle(!isManageLists)}
            activeText="Lists"
            inActiveText="Tokens"
            width="100%"
          />
        </MarginWrap>
        {isManageLists && (
          <MarginWrap>
            <TokenListRow>
              <RowBetween>
                <Flex>
                  <Box>
                    <img
                      alt="coingecko"
                      style={{ float: 'left', width: '50px', height: '50px', marginRight: '1rem' }}
                      src="/images/coingecko.png"
                    />
                  </Box>
                  <Box>
                    <TYPE.mediumHeader>CoinGecko</TYPE.mediumHeader>
                    <TYPE.main fontWeight={600} fontSize={[10, 12, 14]} style={{}}>
                      {tokenLength} tokens
                      <ExternalLink
                        style={{ marginLeft: '0.3rem' }}
                        id="coingecko-link"
                        href="https://www.coingecko.com/en/coins/zero-exchange"
                      >
                        <Info size={14} />
                      </ExternalLink>
                    </TYPE.main>
                  </Box>
                </Flex>

                <Toggle
                  isActive={isCoingeckoListOn}
                  toggle={() => showCoinGeckoList(!isCoingeckoListOn)}
                  activeText="On"
                  inActiveText="Off"
                  width="100px"
                />
              </RowBetween>
            </TokenListRow>
          </MarginWrap>
        )}
        {!isManageLists && userTokens.length > 0 && (
          <MarginWrap>
            <RowBetween style={{ padding: '0 15px' }}>
              <TYPE.main fontWeight={600} fontSize={[10, 12, 14]}>
                {userTokens.length
                  ? `${userTokens.length} Custom token${(userTokens.length === 1 ? '' : 's')}`
                  : ''}
              </TYPE.main>
              <LinkStyledButton onClick={() => removeAllTokens()}>Clear all</LinkStyledButton>
            </RowBetween>
            <div style={{ flex: '1', marginTop: '20px' }}>
              <AutoSizer disableWidth>
                {({ height }) => (
                  <CurrencyList
                    isUserTokens={true}
                    height={height}
                    showETH={false}
                    currencies={userTokens}
                    onCurrencySelect={handleCurrencySelect}
                    otherCurrency={otherSelectedCurrency}
                    selectedCurrency={selectedCurrency}
                    fixedListRef={fixedList}
                    searchQuery={debouncedQuery}
                  />
                )}
              </AutoSizer>
            </div>
          </MarginWrap>
        )}
        {!isManageLists && !userTokens.length && (
          <MarginWrap>
            <TYPE.main style={{ textAlign: 'center' }}>There are no added tokens by user</TYPE.main>
          </MarginWrap>
        )}
      </Column>
    )
  }

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      {!isManageTokenList && (
        <>
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
            {(
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
              <SortButton
                ascending={invertSearchOrder}
                toggleSortOrder={() => setInvertSearchOrder(!invertSearchOrder)}
              />
            </RowBetween>
          </PaddedColumn>

          <Separator />
          <div style={{ flex: '1' }}>
            <AutoSizer disableWidth>
              {({ height }) => (
                <CurrencyList
                  loadMore={loadMore}
                  height={height}
                  showETH={isCrossChain ? false : showETH}
                  currencies={isCrossChain || searchQuery || !isCoingeckoListOn ? filteredSortedTokens : arrayToShow}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                  searchQuery={debouncedQuery}
                />
              )}
            </AutoSizer>
          </div>

          <Separator />
        </>
      )}

      {isEthChain && !isManageTokenList && !isCrossChain && (
        <Card>
          <RowCenter>
            <LinkStyledButton
              style={{ fontWeight: 500, color: theme.text2, fontSize: 16 }}
              onClick={() => setIsManageTokenList(!isManageTokenList)}
              id="currency-search-change-list-button"
            >
              Manage Token Lists
            </LinkStyledButton>
          </RowCenter>
        </Card>
      )}
      {isManageTokenList && (
        <ManageList tokenLength={checksumedCoingeckoList.length} setIsManageTokenList={setIsManageTokenList} />
      )}
    </Column>
  )
}
