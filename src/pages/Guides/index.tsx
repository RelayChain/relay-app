import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { Book } from 'react-feather'
import React from 'react'
import { TYPE } from '../../theme'
import { Wrapper } from '../../components/swap/styleds'
import styled from 'styled-components'

const GuideItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: rgba(255, 255, 255, 0.075);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  margin-bottom: 1.5rem;
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  h4 {
    margin: 0;
  }
`
export default function() {
  const goToSite = (str: any) => {
    window.open(str, '_blank')
  }

  return (
    <AppBody>
      <AutoColumn style={{ minHeight: 200, justifyContent: 'center', alignItems: 'center' }}>
        <h2>Guides for Zero Exchange:</h2>
        <GuideItem onClick={() => goToSite('https://blog.zero.exchange/pre-launch-checklist/')}>
          <Book size={20} style={{ marginRight: '4px', minWidth: '30px' }} />
          <h4>How to manage your Metamask RPC</h4>
        </GuideItem>
        <GuideItem onClick={() => goToSite('https://blog.zero.exchange/how-to-cross-chain-swap/')}>
          <Book size={20} style={{ marginRight: '4px', minWidth: '30px' }} />
          <h4>How to swap tokens on Zero</h4>
        </GuideItem>
        <GuideItem onClick={() => goToSite('https://paintspacer.substack.com/p/how-to-get-avax-to-metamask')}>
          <Book size={20} style={{ marginRight: '4px', minWidth: '30px' }} />
          <h4>Withdrawing AVAX from an exchange</h4>
        </GuideItem>
        <GuideItem onClick={() => goToSite('https://blog.zero.exchange/zero-exchange-staking-guide/')}>
          <Book size={20} style={{ marginRight: '4px', minWidth: '30px' }} />
          <h4>Staking Guide 101</h4>
        </GuideItem>
        <GuideItem onClick={() => goToSite('https://blog.zero.exchange/zero-avalanche-mainnet-liquidity-mining/')}>
          <Book size={20} style={{ marginRight: '4px', minWidth: '30px' }} />
          <h4>Liquidity mining on Zero</h4>
        </GuideItem>
      </AutoColumn>
    </AppBody>
  )
}
