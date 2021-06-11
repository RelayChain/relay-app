import { AVAX, BNB, DEV, MATIC, HECO, ChainId, Currency, ETHER, Token, currencyEquals } from '@zeroexchange/sdk'

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
  transition: all 0.1s ease-in-out;
  ${({ disable }) =>
    !disable &&
    `&:hover {
      cursor: pointer;
      background: rgba(255,255,255,.075);
    }`}
  ${({ disable }) => disable && `opacity: .4`}
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
        {chainId && (chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY) && (
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
        {(chainId && chainId === ChainId.AVALANCHE) ||
          (chainId === ChainId.FUJI && (
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
          ))}
        {(chainId && chainId === ChainId.SMART_CHAIN) ||
          (chainId === ChainId.SMART_CHAIN_TEST && (
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
          ))}
        {chainId && chainId === ChainId.MOONBASE_ALPHA && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, DEV)) {
                onSelect(DEV)
              }
            }}
            disable={selectedCurrency === DEV}
          >
            <CurrencyLogo currency={DEV} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
              DEV
            </Text>
          </BaseWrapper>
        )}
        {chainId && (chainId === ChainId.MUMBAI || chainId === ChainId.MATIC) && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, MATIC)) {
                onSelect(MATIC)
              }
            }}
            disable={selectedCurrency === MATIC}
          >
            <CurrencyLogo currency={MATIC} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
              MATIC
            </Text>
          </BaseWrapper>
        )}
        {chainId && chainId === ChainId.HECO && (
          <BaseWrapper
            onClick={() => {
              if (!selectedCurrency || !currencyEquals(selectedCurrency, HECO)) {
                onSelect(HECO)
              }
            }}
            disable={selectedCurrency === HECO}
          >
            <CurrencyLogo currency={HECO} style={{ marginRight: 8 }} />
            <Text fontWeight={500} fontSize={16}>
            HT
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
