import { AutoColumn } from '../Column'
import { ButtonOutlined } from '../Button'
import { CheckCircle } from 'react-feather'
import React from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'

const Message = styled.p`
  font-size: 0.85rem;
  margin-top: 1rem;
  line-height: 20px;
  color: #ced0d9;
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

export default function TransferComplete({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
}) {
  return (
    <AutoColumn gap="12px" justify={'center'}>
      <RowFixed style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <CheckCircle size={'66'} style={{ margin: '.5rem', color: '#27AE60' }} />
        <CheckCircle size={'66'} style={{ margin: '.5rem', color: '#27AE60' }} />
      </RowFixed>
      <RowFixed style={{ width: '100%', marginTop: '1rem' }}>
        <Text fontSize={17} textAlign="center" style={{ lineHeight: '20px' }}>
          <b>
            {transferAmount} {currentToken?.symbol}{' '}
          </b>
          tokens were successfully transferred into the ChainBridge, and are now being sent from {activeChain} to{' '}
          {transferTo}.
        </Text>
      </RowFixed>
      <RowFixed style={{ width: '100%' }}>
        <Text fontSize={17} textAlign="center" style={{ lineHeight: '20px' }}>
          We are busy relaying the transaction across the chains, this process can sometimes take up to 15
          minutes.
        </Text>
      </RowFixed>
      <RowFixed>
        <Message>
          To see your token assets on the correct chain, you must
          <a
            href="https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-a-custom-Network-RPC-and-or-Block-Explorer"
            rel="noopener noreferrer"
            target="_blank"
          >
            configure the Network RPC
          </a>
          of your connected wallet.
        </Message>
      </RowFixed>
      <RowFixed style={{ width: '100%' }}>
        <ButtonOutlined onClick={onDismiss}>Close</ButtonOutlined>
      </RowFixed>
    </AutoColumn>
  )
}
