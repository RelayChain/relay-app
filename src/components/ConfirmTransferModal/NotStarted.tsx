import { RowBetween, RowFixed } from '../Row'

import { AutoColumn } from '../Column'
import { ArrowDown, ArrowRight } from '../Arrows'
import BlockchainLogo from '../BlockchainLogo'
import { ButtonPrimary } from '../Button'
import { ChainTransferState } from '../../state/crosschain/actions'
import { Currency } from '@zeroexchange/sdk'
import CurrencyLogo from '../CurrencyLogo'
import React from 'react'
import { Text } from 'rebass'
import { Trade } from '@zeroexchange/sdk'
import { TruncatedText } from './styleds'
import styled from 'styled-components'
import { useCrosschainHooks } from '../../state/crosschain/hooks'

interface NotStartedProps {
  activeChain?: string
  transferTo?: string
  currency?: Currency | null
  value?: any
  trade?: Trade
  changeTransferState: (state: ChainTransferState) => void
  tokenTransferState: ChainTransferState
}

const ChainContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
flex-direction: row;
justify-content: space-evenly;
margin: 10px auto;
`};
`

const ChainItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  position: relative;
  height: 120px;
  width: 120px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  background: rgba(18, 21, 56, 0.24);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(28px);
  border-radius: 22px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  height: 87px;
  width: 150px;
  margin: 0.5rem;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  height: 0px;
  width: 0px;
  background: none;
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(0px);
`};
`
const ChainMessage = styled.p`
  font-size: 0.85rem;
  line-height: 1.25rem;
  a {
    font-weight: bold;
    color: ${({ theme }) => theme.primary1};
    cursor: pointer;
    outline: none;
    text-decoration: none;
    margin-left: 4px;
    margin-right: 4px;
  }
`
const HideSmall = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`
const ShowSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: block;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
display: none;
`};
`
const ShowExtraSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
`};
`
export default function NotStarted({
  activeChain,
  transferTo,
  currency,
  value,
  trade,
  changeTransferState,
  tokenTransferState
}: NotStartedProps) {
  const { MakeApprove } = useCrosschainHooks()

  const formatValue = (value: string) => {
    return parseFloat(parseFloat(value).toFixed(6)).toString()
  }

  return (
    <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap={'0px'}>
          {currency && (
            <CurrencyLogo size="24px" currency={currency} style={{ marginBottom: '-3px', marginRight: '12px' }} />
          )}
          <TruncatedText fontSize={24} fontWeight={500} color={''}>
            {formatValue(value)}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap={'0px'}>
          <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
            {currency?.symbol}
          </Text>
        </RowFixed>
      </RowBetween>

      <ChainContainer>
        <ChainItem>
          <BlockchainLogo size="28px" blockchain={activeChain} />
          <span>{activeChain}</span>
        </ChainItem>
        <HideSmall>
          <ArrowRight color="white" />
        </HideSmall>
        <ShowSmall>
          <ArrowDown />
        </ShowSmall>
        <ShowExtraSmall>
          <ArrowRight color="white" width="21" height="21" />
        </ShowExtraSmall>
        <ChainItem>
          <BlockchainLogo size="28px" blockchain={transferTo} />
          <span>{transferTo}</span>
        </ChainItem>
      </ChainContainer>

      <RowFixed gap={'0px'}>
        <ChainMessage>
          You will be transfering your {activeChain} tokens to the {transferTo} Blockchain. You must
          <a
            href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-Network-RPC-and-or-Block-Explorer"
            rel="noopener noreferrer"
            target="_blank"
          >
            switch your RPC Network
          </a>
          to the appropriate settings once this is complete to view your tokens.
        </ChainMessage>
      </RowFixed>
      <RowBetween></RowBetween>
      <RowFixed style={{ width: '100%' }}>
        <ButtonPrimary
          onClick={() => {
            MakeApprove().catch(console.error)
            // changeTransferState(ChainTransferState.ApprovalPending)
          }}
        >
          Approve Transfer
        </ButtonPrimary>
      </RowFixed>
    </AutoColumn>
  )
}
