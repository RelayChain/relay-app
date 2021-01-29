import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'

import { AutoColumn } from '../../components/Column'
import { ButtonUNIGradient } from '../../components/Button'
import { ChainId } from '@zeroexchange/sdk';
//import { BIG_INT_ZERO } from '../../constants'
import { Countdown } from './Countdown'
import { Link } from 'react-router-dom'
//import { JSBI } from '@zeroexchange/sdk'
import Loader from '../../components/Loader'
import { OutlineCard } from '../../components/Card'
import PoolCard from '../../components/earn/PoolCard'
import React from 'react'
import { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'

const PageWrapper = styled(AutoColumn)`
  max-width: 640px;
  width: 100%;
`

// const TopSection = styled(AutoColumn)`
//   max-width: 720px;
//   width: 100%;
// `

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
  background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
  overflow: hidden;
`

// const ResponsiveButtonPrimary = styled(ButtonPrimary)`
//   width: fit-content;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     width: 48%;
//   `};
// `

export default function Earn() {

  // get chainId
  const { chainId } = useActiveWeb3React()

  const pools = {
    [ChainId.MAINNET]: [
      {
        baseSymbol: 'ETH',
        baseAddress: 'ETH',
        otherSymbol: 'ZERO',
        otherAddress: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574'
      }
    ],
    [ChainId.AVALANCHE]: [
      {
        baseSymbol: 'AVAX',
        baseAddress: 'avaxaddresshere',
        otherSymbol: 'ZERO',
        otherAddress: '0xF0939011a9bb95c3B791f0cb546377Ed2693a574'
      }
    ]
  }

  // staking info for connected account
  const stakingInfos = useStakingInfo()
  /**
   * only show staking cards with balance
   * @todo only account for this if rewards are inactive
   */
  const stakingInfosWithBalance = stakingInfos

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  return (
    <PageWrapper gap="lg" justify="center">
      <VoteCard>
        <CardBGImage />
        <CardNoise />
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
          { chainId && pools[chainId] &&
            pools[chainId].map((pool: any, index: number) =>
              <ButtonUNIGradient
                key={index}
                id={`join-pool-button-${pool.baseSymbol}${pool.otherSymbol}`}
                as={Link}
                padding="6px 8px"
                to={`/add/${pool.baseAddress}/${pool.otherAddress}`}
                style={{ margin: '20px 0px 0px auto' }}
              >
                <Text fontWeight={500} fontSize={16}>
                  Add {`${pool.baseSymbol}/${pool.otherSymbol}`} Liquidity
                </Text>
              </ButtonUNIGradient>
            )
          }
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      {/*<TopSection gap="md">
        <DataCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Zero liquidity mining</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  Deposit your Liquidity Provider tokens to receive ZERO, the Zero.Exchange protocol governance token.
                </TYPE.white>
              </RowBetween>{' '}
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                href="https://zero.exchange/learn-more"
                target="_blank"
              >
                <TYPE.white fontSize={14}>Learn more about ZERO</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </DataCard>
      </TopSection>*/}

      <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Participating pools</TYPE.mediumHeader>
          <Countdown exactEnd={stakingInfos?.[0]?.periodFinish} />
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
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
