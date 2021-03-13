import { ButtonSecondary, ButtonUNIGradient } from '../../components/Button'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
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
import { TYPE } from '../../theme'
import { Text } from 'rebass'
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
        baseSymbol: 'ZERO',
        baseAddress: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7',
        otherSymbol: 'zETH',
        otherAddress: '0xf6F3EEa905ac1da6F6DD37d06810C6Fcb0EF5183'
      },
      {
        baseSymbol: 'ZERO',
        baseAddress: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7',
        otherSymbol: 'USDC',
        otherAddress: '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb'
      },
      {
        baseSymbol: 'ZERO',
        baseAddress: '0x008E26068B3EB40B443d3Ea88c1fF99B789c10F7',
        otherSymbol: 'AVAX',
        otherAddress: 'AVAX'
      },
      {
        baseSymbol: 'AVAX',
        baseAddress: 'AVAX',
        otherSymbol: 'USDC',
        otherAddress: '0x474Bb79C3e8E65DcC6dF30F9dE68592ed48BBFDb'
      },
      {
        baseSymbol: 'AVAX',
        baseAddress: 'AVAX',
        otherSymbol: 'zETH',
        otherAddress: '0xf6F3EEa905ac1da6F6DD37d06810C6Fcb0EF5183'
      }
    ],
    [ChainId.SMART_CHAIN]: [
      // https://bscscan.com/tx/0x11e8e1766788581dd7597c5eae53a4ebb0709f45b22850822f54c553e9eaca8c
      {
        baseSymbol: 'ZERO',
        baseAddress: '0x1f534d2B1ee2933f1fdF8e4b63A44b2249d77EAf',
        otherSymbol: 'BNB',
        otherAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      },
      // {
      //   baseSymbol: 'BNB',
      //   baseAddress: 'BNB',
      //   otherSymbol: 'BUSD',
      //   otherAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      // },
      
      // https://bscscan.com/tx/0x11e8e1766788581dd7597c5eae53a4ebb0709f45b22850822f54c553e9eaca8c
      {
        baseSymbol: 'ZERO',
        baseAddress: '0x1f534d2b1ee2933f1fdf8e4b63a44b2249d77eaf',
        otherSymbol: 'BUSD',
        otherAddress: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      },
    ]
  };

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
            <div style={{ display: 'block', width: '100%' }}>
              <h3 style={{ marginBottom: '.5rem' }}>Add Liquidity:</h3>
              {chainId &&
                pools[chainId] &&
                pools[chainId].map((pool: any, index: number) => (
                  <>
                    <ButtonUNIGradient
                      key={index}
                      id={`join-pool-button-${pool.baseSymbol}${pool.otherSymbol}`}
                      as={Link}
                      to={`/add/${pool.baseAddress}/${pool.otherAddress}`}
                      style={{
                        margin: '1rem .5rem',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text fontWeight={500} fontSize={14}>
                        {`${pool.baseSymbol}/${pool.otherSymbol}`}
                      </Text>
                    </ButtonUNIGradient>
                  </>
                ))}
            </div>
          </AutoColumn>
        </CardSection>
        <CardBGImage />
        <CardNoise />
      </VoteCard>

      <RowBetween /**style={{ opacity: '.5', pointerEvents: 'none'}}*/>
        <ResponsiveButtonSecondary
          as={Link}
          padding="6px 8px"
          to={`create/${(chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY) ? 'ETH' : chainId === ChainId.SMART_CHAIN ? 'BNB' : 'AVAX'}`}
          style={{ margin: '5px 5px 5px auto' }}
        >
          Create New Pool Pair
        </ResponsiveButtonSecondary>
      </RowBetween>

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
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
            })
          )}
        </PoolSection>
      </AutoColumn>
    </PageWrapper>
  )
}
