import { AVAX, BNB, ChainId, Currency, CurrencyAmount, DEV, ETHER, MATIC, Token, currencyEquals, TokenAmount } from '@zeroexchange/sdk'
import { FadedSpan, MenuItem } from './styleds'
import { LinkStyledButton, TYPE } from '../../theme'
import React, { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react'
import { useAddUserToken, useRemoveUserAddedToken } from '../../state/user/hooks'

import BigNumber from 'bignumber.js'
import Column from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { FixedSizeList } from 'react-window'
import Loader from '../Loader'
import { MouseoverTooltip } from '../Tooltip'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { isTokenOnList } from '../../utils'
import { returnBalanceNum } from '../../constants'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance, useTokenBalancesWithSortBalances } from '../../state/wallet/hooks'
import { useIsUserAddedToken } from '../../hooks/Tokens'
import { useTokenBalances } from '../../state/user/hooks'
import {useApplicationState} from 'state/application/hooks'

function currencyKey(currency: Currency): string {
  if (currency instanceof Token) {
    return currency.address
  } else if (currency === ETHER) {
    return 'ETHER'
  } else if (currency === AVAX) {
    return 'AVAX'
  } else if (currency === BNB) {
    return 'BNB'
  } else if (currency === DEV) {
    return 'DEV'
  } else if (currency === MATIC) {
    return 'MATIC'
  } else {
    return ''
  }
}

const StyledBalanceText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`

const Tag = styled.div`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`

function Balance({ balance }: { balance: CurrencyAmount }) {
  return (
    <StyledBalanceText title={balance.toExact()}>
      {balance.toSignificant(returnBalanceNum(balance, 4), { groupSeparator: ',' }) || 0}
    </StyledBalanceText>
  )
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return <span />
  }

  const tags = currency.tags
  if (!tags || tags.length === 0) return <span />

  const tag = tags[0]

  return (
    <TagContainer>
      <MouseoverTooltip text={tag.description}>
        <Tag key={tag.id}>{tag.name}</Tag>
      </MouseoverTooltip>
      {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null}
    </TagContainer>
  )
}

const weiToEthNum = (balance: any, decimals = 18) => {
  const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
  return displayBalance.toNumber()
}

function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  isEnd,
  hasQuery,
  tokenBalances,
  unseenCustomToken = false
}: {
  currency: any
  onSelect: () => void
  isSelected: boolean
  otherSelected: boolean
  style: CSSProperties
  isEnd: boolean
  hasQuery: any
  tokenBalances: any
  unseenCustomToken?: boolean
}) {
  const {isLightMode} = useApplicationState()
  const { account, chainId } = useActiveWeb3React()
  const key = currencyKey(currency)
  const customAdded = useIsUserAddedToken(currency)

  const balance = useCurrencyBalance(account ?? undefined, currency, chainId)
  const removeToken = useRemoveUserAddedToken()
  const addToken = useAddUserToken()

  const hasABalance = useMemo(() => {
    return balance && parseFloat(balance.toSignificant(6)) > 0.0000001 ? true : false;
  }, [balance])

  // only show add or remove buttons if not on selected list
  const isNative = () => {
    return [ETHER, AVAX, BNB, DEV, MATIC].includes(currency)
  }

  if (unseenCustomToken && customAdded) {
    return null
  }

  return (
    <MenuItem
      style={{
        ...style,
        background:`${isLightMode ? '#1f224a' : '#fff'}`,
        borderBottom: `${!isEnd ? '1px solid rgba(255,255,255,.035)' : 'none'}`
      }}
      className={`token-item-${key}`}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      selected={otherSelected}
    >
      <CurrencyLogo currency={currency} size={'24px'} />
      <Column>
        <Text title={currency?.name} fontWeight={500}>
          {currency?.symbol}
        </Text>
        {!isNative() && (
          <FadedSpan>
            {customAdded ? (
              <TYPE.main fontWeight={500}>
                Added by user
                <LinkStyledButton
                  onClick={event => {
                    event.stopPropagation()
                    if (chainId && currency instanceof Token) removeToken(chainId, currency?.address)
                  }}
                >
                  (Remove)
                </LinkStyledButton>
              </TYPE.main>
            ) : null}
            {/* Fix this so (Add) works for Avax support */}
            {hasQuery && !customAdded ? (
              <TYPE.main fontWeight={500}>
                Found by address
                <LinkStyledButton
                  onClick={event => {
                    event.stopPropagation()
                    if (currency instanceof Token) addToken(currency)
                  }}
                >
                  (Add)
                </LinkStyledButton>
              </TYPE.main>
            ) : null}
          </FadedSpan>
        )}
      </Column>
      <TokenTags currency={currency} />
      <RowFixed style={{ justifySelf: 'flex-end' }}>
        {balance && hasABalance ? <Balance balance={balance} /> : account && !balance ? <Loader /> : 0}
      </RowFixed>
    </MenuItem>
  )
}

export default function CurrencyList({
  height,
  currencies,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showETH,
  searchQuery,
  unseenCustomToken = false,
  isAscendingFilter = false
}: {
  height: number
  currencies: Currency[]
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherCurrency?: Currency | null
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
  showETH: boolean
  searchQuery: string | undefined
  unseenCustomToken?: boolean,
  isAscendingFilter?: boolean
}) {
  const { chainId } = useActiveWeb3React()
  const tokenBalances = useTokenBalances()

  const nativeToken =
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
      ? Currency.ETHER
      : chainId === ChainId.SMART_CHAIN || chainId === ChainId.SMART_CHAIN_TEST
        ? Currency.BNB
        : chainId === ChainId.MOONBASE_ALPHA
          ? Currency.DEV
          : chainId === ChainId.MUMBAI || chainId === ChainId.MATIC
            ? Currency.MATIC
            : Currency.AVAX
  const itemData = useMemo(() => (showETH ? [nativeToken, ...currencies] : currencies), [
    currencies,
    showETH,
    nativeToken
  ])
  
  const sortTokensByBalance = useTokenBalancesWithSortBalances(isAscendingFilter)
  
    const sortedTokensByAmount = Object.values(Object.assign({}, sortTokensByBalance[0])) ;
    const sortItemDataByBalance = sortedTokensByAmount.length ? [nativeToken, ...sortedTokensByAmount.map
      ((token: TokenAmount) => itemData.find(curr => curr.name === token.token.name))]
      : itemData
 

  const Row = useCallback(
    ({ data, index, style }) => {

      const currency: Currency = data[index]
      const isSelected = Boolean(selectedCurrency && currencyEquals(selectedCurrency, currency))
      const otherSelected = Boolean(otherCurrency && currencyEquals(otherCurrency, currency))
      const handleSelect = () => onCurrencySelect(currency)
      return (
        <CurrencyRow
          style={style}
          currency={currency}
          isSelected={isSelected}
          onSelect={handleSelect}
          otherSelected={otherSelected}
          tokenBalances={tokenBalances}
          isEnd={index === data.length - 1}
          hasQuery={searchQuery && searchQuery.length > 0}
          unseenCustomToken={unseenCustomToken}
        />
      )
    },
    [onCurrencySelect, otherCurrency, selectedCurrency, searchQuery]
  )

  const itemKey = useCallback((index: number, data: any) => currencyKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={sortItemDataByBalance}
      itemCount={sortItemDataByBalance?.length}
      itemSize={56}
      itemKey={itemKey}
      overscanCount={30}
    >
      {Row}
    </FixedSizeList>
  )
}
