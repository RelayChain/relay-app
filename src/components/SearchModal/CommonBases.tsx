import { AVAX, BNB, ChainId, Currency, ETHER, Token, currencyEquals } from '@zeroexchange/sdk'

import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import CurrencyLogo from '../CurrencyLogo'
import QuestionHelper from '../QuestionHelper'
import React from 'react'
import { SUGGESTED_BASES } from '../../constants'
import { Text } from 'rebass'
import styled from 'styled-components'

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid ${({ theme, disable }) => (disable ? 'transparent' : theme.bg3)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
    background-color: ${({ theme, disable }) => !disable && theme.bg2};
  }

  background-color: ${({ theme, disable }) => disable && theme.bg3};
  opacity: ${({ disable }) => disable && '0.4'};
`

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency
}: {
  chainId?: ChainId
  selectedCurrency?: Currency | null
  onSelect: (currency: Currency) => void
}) {
  const zeroToken = new Token(1, '0xF0939011a9bb95c3B791f0cb546377Ed2693a574', 18, 'ZERO', 'Zero')
  const array: any = chainId ? SUGGESTED_BASES[chainId] : []
  if (chainId && chainId === 1 && !array.find((x: any) => x.address === '0xF0939011a9bb95c3B791f0cb546377Ed2693a574')) {
    array.unshift(zeroToken)
  }

  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontWeight={500} fontSize={14}>
          Common bases
        </Text>
        <QuestionHelper text="These tokens are commonly paired with other tokens." />
      </AutoRow>
      <AutoRow gap="4px">
        {chainId && chainId === ChainId.MAINNET && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
                onSelect(ETHER)
              }
            }}
            disable={selectedCurrency === ETHER}
          >
            <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
              ETH
            </Text>
          </BaseWrapper>
        )}
        {chainId && chainId === ChainId.AVALANCHE && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, AVAX)) {
                onSelect(AVAX)
              }
            }}
            disable={selectedCurrency === AVAX}
          >
            <CurrencyLogo currency={AVAX} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
              AVAX
            </Text>
          </BaseWrapper>
        )}
        {chainId && chainId === ChainId.SMART_CHAIN && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, BNB)) {
                onSelect(BNB)
              }
            }}
            disable={selectedCurrency === BNB}
          >
            <CurrencyLogo currency={BNB} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
              BNB
            </Text>
          </BaseWrapper>
        )}
        {array.map((token: Token) => {
          const selected = selectedCurrency instanceof Token && selectedCurrency.address === token.address
          return (
            <BaseWrapper onClick={() => !selected && onSelect(token)} disable={selected} key={token.address}>
              <CurrencyLogo currency={token} style={{ marginRight: 8 }} />
              <Text fontWeight={500} fontSize={16}>
                {token.symbol}
              </Text>
            </BaseWrapper>
          )
        })}
      </AutoRow>
    </AutoColumn>
  )
}
