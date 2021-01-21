import { RowBetween, RowFixed } from '../Row'

import { AutoColumn } from '../Column'
import BlockchainLogo from '../BlockchainLogo';
import { ButtonPrimary } from '../Button'
import { ChainTransferState } from '../../pages/Swap';
import { ChevronsRight } from 'react-feather'
import { Currency } from '@zeroexchange/sdk'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'
import { Text } from 'rebass'
import { Trade } from '@zeroexchange/sdk'
import { TruncatedText } from './styleds'
import styled from 'styled-components'

interface NotStartedProps {
  activeChain?: string;
  transferTo?: string;
  currency?: Currency | null;
  value?: string;
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void;
  tokenTransferState: ChainTransferState;
}

const ChainContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 1px dashed ${({ theme }) => theme.primary1};
  border-radius: 12px;
`

const ChainItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  position: relative;
  padding: 12px;
  transition: all .2s ease-in-out;
  border-radius: 12px;
  img {
    margin: auto;
    margin-bottom: .5rem;
  }
`
const ChainMessage = styled.p`
  font-size: .85rem;
  line-height: 1.25rem;
  a {
    font-weight: bold;
    color: ${({ theme }) => theme.primary1};
    cursor: pointer;
    outline: none;
    text-decoration: none;
    margin-left: 4px; margin-right: 4px;
  }
`

export default function NotStarted ({
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState,
}: NotStartedProps) {
  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          <CurrencyLogo currency={trade?.inputAmount.currency} size={'24px'} style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize={24}
            fontWeight={500}
            color={''}
          >
            {trade?.inputAmount.toSignificant(6)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {trade?.inputAmount.currency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed gap={'0px'} style={{ margin: '1.5rem auto' }}>
        <ChainContainer>
          <ChainItem>
            <BlockchainLogo size="28px" blockchain={activeChain} />
            <span>{activeChain}</span>
          </ChainItem>
          <ChevronsRight />
          <ChainItem>
            <BlockchainLogo size="28px" blockchain={transferTo} />
            <span>{transferTo}</span>
          </ChainItem>
        </ChainContainer>
      </RowFixed>
      <RowFixed gap={'0px'}>
        <ChainMessage>
          You will be transfering your {activeChain} tokens to the {transferTo} Blockchain. You must
          <a href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-Network-RPC-and-or-Block-Explorer"
            rel="noopener noreferrer"
            target="_blank">switch your RPC Network
          </a>
          to the appropriate settings once this is complete to view your tokens.
        </ChainMessage>
      </RowFixed>
      <RowBetween></RowBetween>
      <RowFixed style={{ width: '100%'}}>
        <ButtonPrimary onClick={() => changeTransferState(ChainTransferState.ApprovalPending)}>
          Approve Transfer
        </ButtonPrimary>
      </RowFixed>
    </AutoColumn>
  )
}
