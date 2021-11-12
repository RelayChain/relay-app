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

const Staking = () => {
  return (
    <>
      <Title>Stake Relay, Earn Rewards</Title>
      <StakingHeader />
      <PageContainer>
        <StakingControls />
        <WrapStakingCard>
          <StakingCard />
        </WrapStakingCard>
      </PageContainer>
    </>
  )
}

export default Staking
