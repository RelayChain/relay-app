// import BlockchainLogo from '../BlockchainLogo';
import { ChevronsRight, RefreshCcw } from 'react-feather'

import React from 'react'
import styled from 'styled-components'

const TabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const Tab = styled.div<{ active?: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #fff;
  height: 36px;
  line-height: 36px;
  font-size: .9rem;
  font-weight: bold;
  padding: .5rem .25rem;
  margin: 1rem;
  border-radius: 12px;
  background: ${({ active, theme }) => (active ? theme.primary1 : 'transparent')};
  transition: all .2s ease-in-out;
  &:hover {
    cursor: pointer;
    background: ${({ active, theme }) => (active ? theme.primary1 : 'rgba(38, 98, 255, .25)')};
  }
`
const SwapsTabs = ({
  isCrossChain,
  onSetIsCrossChain
}: {
  onSetIsCrossChain: (value: boolean) => void
  isCrossChain?: boolean
}) => {
  return (
    <TabsContainer>
      <Tab active={isCrossChain ? false : true} onClick={() => onSetIsCrossChain(false)}>
        Swaps
        <RefreshCcw size="14" style={{ marginLeft: '4px' }} />
      </Tab>
      <Tab active={isCrossChain ? true : false} onClick={() => onSetIsCrossChain(true)}>
        Cross-Chain Transfer
        <ChevronsRight size="14" style={{ marginLeft: '4px' }} />
      </Tab>
    </TabsContainer>
  )
}

export default SwapsTabs
