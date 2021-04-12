import { DataCard } from '../../components/earn/styled'
import { ExternalLink, TYPE } from '../../theme'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'

import { AutoColumn } from '../../components/Column'
import { ButtonSecondary } from '../../components/Button'
import { ChainId } from '@zeroexchange/sdk'
import { Countdown } from './Countdown'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import { OutlineCard } from '../../components/Card'
import PoolRow from '../../components/earn/PoolRow'
import PoolCard from '../../components/earn/PoolCard'

import React from 'react'
import { RowBetween } from '../../components/Row'
import { Zap } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled.div`
  padding: 0px 64px;
  width: 100%;
`
const Title = styled.h1`
  margin-bottom: 70px;
`
const Wrapper = styled.div`
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-bottom: 1rem;
  padding: 30px 45px;
  width: 100%;
  overflow: hidden;
  position: relative;
`
const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
`
const PoolSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10px;
  row-gap: 15px;
  width: 100%;
  justify-self: center;
`

const DataRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
flex-direction: column;
`};
`
const VoteCard = styled(DataCard)`
  background: #111;
  overflow: hidden;
  border: 2px solid rgba(28, 176, 249, 0.45);
`

export default function Pools() {
  // get chainId
  const { chainId } = useActiveWeb3React()

  // staking info for connected account
  const stakingInfos = useStakingInfo()
  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  const stakingInfosWithBalance = stakingInfos.filter(x => x.active)
  const finishedPools = stakingInfos.filter(x => !x.active)

  let timeToStakingFinish = stakingInfos?.[0]?.periodFinish
  stakingInfos.map(item => {
    const period = item ? item.periodFinish : timeToStakingFinish
    if (period && item.active && timeToStakingFinish && timeToStakingFinish < period) {
      timeToStakingFinish = period
    }
  })
  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <>
      <PageWrapper>
      <Title>POOL</Title>
        <Wrapper>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>
                  <TYPE.main fontWeight={600} fontSize={12} style={{ textAlign: 'left' }}>
                    Type
                  </TYPE.main>
                </th>
                <th>
                  <TYPE.main fontWeight={600} fontSize={12}>
                    Earned
                  </TYPE.main>
                </th>
                <th>
                  <TYPE.main fontWeight={600} fontSize={12}>
                    APR
                  </TYPE.main>
                </th>
                <th>
                  <TYPE.main fontWeight={600} fontSize={12}>
                    Liquidity
                  </TYPE.main>
                </th>
                <th>
                  <TYPE.main fontWeight={600} fontSize={12}>
                    Multiplier
                  </TYPE.main>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stakingInfosWithBalance?.map(stakingInfo => {
                // need to sort by added liquidity here
                return <PoolRow key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
              })}
            </tbody>
          </table>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : null}
        </Wrapper>

        <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
          <DataRow style={{ alignItems: 'baseline' }}>
            <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
            <Countdown exactEnd={timeToStakingFinish} />
          </DataRow>
          <PoolSection></PoolSection>

          {finishedPools?.length > 0 && (
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Closed pools:</TYPE.mediumHeader>
            </DataRow>
          )}
          {finishedPools?.length > 0 &&
            finishedPools.map(stakingInfo => {
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
            })}
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
