import React from 'react'
import styled from 'styled-components'

import PageContainer from './../../components/PageContainer'
import { Title } from '../../theme'

import { StakingControls, StakingHeader, StakingCard } from './../../components/staking'

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
      <Title>Staking</Title>
      <StakingHeader />
      <PageContainer>
        <StakingControls />
        <WrapStakingCard>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
            return <StakingCard key={item} />
          })}
        </WrapStakingCard>
      </PageContainer>
    </>
  )
}

export default Staking
