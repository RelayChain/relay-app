import { StakingCard, StakingControls, StakingHeader } from './../../components/staking'

import PageContainer from './../../components/PageContainer'
import React from 'react'
import { Title } from '../../theme'
import styled from 'styled-components'

const WrapStakingCard = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`

const stakingConfig = [
  {
    name: 'usdc',
    // ChainId: address
    // we are going to show this as a list of chains to switch to.
    tokenAddrs: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      2: '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    },
    stakingContract: {
      addr: '0x00000',
    }
  },
  {
    name: 'eth',
  }
]

export const LiquidityStaking = () => {
  const tokenlist = stakingConfig.map(c => c.name);

  const getAvailableChainsForToken = (name: any) => {
    stakingConfig
      .find(c => c.name == name)
  };

  return (
    <>
      <p>Select the token from: {tokenlist.join(', ')}</p>

      If not on metis, show "To stake, you need to crosschain send USDC from some of these chains:"
      show the available chains for token.

      "To Metis. See "

      Possibly switch chain once pressed?

      display an instruction: To stake, you have to bridge the token first. Go to bridge, transfer some `stake-USDC` to metis.
      After that, come back to this page.
  
      Search in code for:<br />
      <code>const ethMethod = chainsConfig.networkId === 1 ? 'wallet_switchEthereumChain' : 'wallet_addEthereumChain'</code>      

      Then the usual frontend page for staking. I'm wondering if we can use the existing component for staking..
      Display the balance for stake-USDC  
      button stake
      button unstake
      button harvest

      And in an ideal world, if the person wants to get his real USDC back, we would show how much USDC we have on each chain.
      

      {/* <StakingHeader />
      <PageContainer>
        <StakingControls />
        <WrapStakingCard>
          <StakingCard />
        </WrapStakingCard>
      </PageContainer> */}
    </>
  )
}

