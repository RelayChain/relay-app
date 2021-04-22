import { ButtonSecondary, ButtonUNIGradient } from '../../components/Button'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { ExternalLink, TYPE } from '../../theme'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'

import { AutoColumn } from '../../components/Column'
import { ChainId } from '@zeroexchange/sdk'
//import { BIG_INT_ZERO } from '../../constants'
import { Countdown } from './Countdown'
import { Link } from 'react-router-dom'
//import { JSBI } from '@zeroexchange/sdk'
import Loader from '../../components/Loader'
import { OutlineCard } from '../../components/Card'
import PoolCard from '../../components/earn/PoolCard'
import React from 'react'
import { RowBetween } from '../../components/Row'
import { Text } from 'rebass'
import { Zap } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
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

export default function Earn() {
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
    <PageWrapper gap="lg" justify="center">
      <VoteCard>
        <CardSection>
          <AutoColumn gap="md">
            <RowBetween>
              <TYPE.white fontWeight={600}>Liquidity provider rewards</TYPE.white>
            </RowBetween>
            <RowBetween>
              <TYPE.white fontSize={14}>
                {`Liquidity providers earn a rewards proportional to their share of the pool. Fees can be added in the future by governance token holders, and would accrue based on your LP token percentage.`}
              </TYPE.white>
            </RowBetween>
          </AutoColumn>
        </CardSection>
      </VoteCard>

      <RowBetween /**style={{ opacity: '.5', pointerEvents: 'none'}}*/>
        <ExternalLink
          href="https://0.exchange/partners"
          target="_blank"
          style={{
            width: '100%',
            textDecoration: 'none',
            color: '#C571F4',
            paddingRight: '1rem',
            position: 'relative'
          }}
        >
          Launch your token on ZERO
          <Zap style={{ position: 'absolute' }} size={'20'} />
        </ExternalLink>
        <ResponsiveButtonSecondary
          as={Link}
          padding="6px 8px"
          to={`create/${
            chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
              ? 'ETH'
              : chainId === ChainId.SMART_CHAIN || chainId === ChainId.SMART_CHAIN_TEST
              ? 'BNB'
              : 'AVAX'
          }`}
          style={{ margin: '5px 5px 5px auto', minWidth: '186px' }}
        >
          Create New Pool Pair
        </ResponsiveButtonSecondary>
      </RowBetween>

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={timeToStakingFinish} />
        </DataRow>
        <PoolSection>
          {stakingRewardsExist && stakingInfos?.length === 0 ? (
            <Loader style={{ margin: 'auto' }} />
          ) : !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : (
            stakingInfosWithBalance?.map(stakingInfo => {
              // need to sort by added liquidity here
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
            })
          )}
        </PoolSection>

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
  )
}
