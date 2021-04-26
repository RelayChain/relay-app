import { ButtonOutlined, ButtonPrimary } from '../../components/Button'
import { ExternalLink, TYPE } from '../../theme'
import React, { useState } from 'react'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import styled, { keyframes } from 'styled-components'

import { AutoColumn } from '../../components/Column'
import { ButtonSecondary } from '../../components/Button'
import { ChainId } from '@zeroexchange/sdk'
import { Countdown } from './Countdown'
import { DataCard } from '../../components/pools/styled'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import NoResults from '../../assets/svg/no_results.svg'
import { OutlineCard } from '../../components/Card'
import PageContainer from './../../components/PageContainer'
import PoolCard from '../../components/pools/PoolCard'
import PoolControls from '../../components/pools/PoolControls'
import PoolRow from '../../components/pools/PoolRow'
import { RowBetween } from '../../components/Row'
import WalletMissing from '../../assets/svg/wallet_missing.svg'
import { Zap } from 'react-feather'
import ZeroIcon from '../../assets/svg/zero_icon.svg'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'

const PageWrapper = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  flex-grow: 1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding:0px;
`};
`
const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
`
const Wrapper = styled.div`
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-bottom: 1rem;
  padding: 30px 45px;
  width: 100%;
  overflow: hidden;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  border-radius: 16px;
  padding: 16px 16px;
`};
`
const PoolsTable = styled.table`
  border-collapse: collapse;
  border-spacing: 0px;
  tr {
    vertical-align: middle;
    &:last-of-type {
      border-bottom-width: 0px;
    }
  }
  td[colspan='6'] {
    width: 100%;
  }

`

const HeaderCell = styled.th<{ mobile?: boolean }>`
  ${({ theme, mobile = true }) =>
    !mobile &&
    theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 64px;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const opacity = keyframes`
  from {
    opacity:.8;
  }
  50%  {  opacity: 0.3;}
  to {
    opacity: .8;
  }
`

// Here we create a component that will rotate everything we pass in over two seconds
const Spinner = styled.img`
  width: 100px;
  height: autp;
  display: inline-block;
  animation: ${rotate} 2s linear infinite, ${opacity} 1.5s linear infinite;

  padding: 2rem 1rem;
  font-size: 1.2rem;
`

const NoAccount = styled.img``
const Message = styled.div`
  padding: 32px;
`
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  column-gap: 28px;
`
export default function Pools() {

  const { account, chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const toggleWalletModal = useWalletModalToggle()
  const [displayMode, setDisplayMode] = useState('grid')

  const stakingInfosWithBalance = stakingInfos.filter(x => x.active)
  const finishedPools = stakingInfos.filter(x => !x.active)

  // filters & sorting
  const [showLive, setShowLive] = useState(true);
  let arrayToShow: any[] = [];

  // live or finished pools?
  if (showLive && stakingInfosWithBalance && stakingInfosWithBalance.length > 0) {
    arrayToShow = stakingInfosWithBalance
  } else if (!showLive && finishedPools && finishedPools.length > 0) {
    arrayToShow = finishedPools;
  }

  // do search logic, filtering, and sorting logic here on arrayToShow

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
      <Title>Pools</Title>
      <PageContainer>
        <PageWrapper>
          {account !== null && <PoolControls displayMode={displayMode} setDisplayMode={setDisplayMode} />}
          {account !== null &&
            stakingInfos?.length > 0 &&
            (displayMode === 'table' ? (
              <Wrapper>
                <PoolsTable style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <HeaderCell>
                        <TYPE.main fontWeight={600} fontSize={12} style={{ textAlign: 'left' }}>
                          Type
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell mobile={false}>
                        <TYPE.main fontWeight={600} fontSize={12}>
                          Reward
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell mobile={false}>
                        <TYPE.main fontWeight={600} fontSize={12}>
                          APR
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell mobile={false}>
                        <TYPE.main fontWeight={600} fontSize={12}>
                          Liquidity
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell mobile={false}>
                        <TYPE.main fontWeight={600} fontSize={12}>
                          Earned
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell></HeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayToShow?.map(stakingInfo => {
                      // need to sort by added liquidity here
                      return <PoolRow key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
                    })}
                  </tbody>
                </PoolsTable>
                {/* : !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : null} */}
              </Wrapper>
            ) : (
              <GridContainer>
                {arrayToShow?.map(stakingInfo => {
                  return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
                })}
              </GridContainer>
            ))}
          {account !== null && stakingRewardsExist && stakingInfos?.length === 0 && (
            <EmptyData>
              <Spinner src={ZeroIcon} />
            </EmptyData>
          )}
          {account === null && (
            <EmptyData>
              <NoAccount src={WalletMissing} />
              <Message>
                <TYPE.main fontWeight={600} fontSize={24} style={{ textAlign: 'center' }}>
                  No Wallet Connected!
                </TYPE.main>
              </Message>
              <div style={{ display: 'flex', flexGrow: 0 }}>
                <ButtonPrimary padding="8px" borderRadius="8px" onClick={toggleWalletModal}>
                  Connect a Wallet
                </ButtonPrimary>
              </div>
              {/* <NoAccount src={NoResults} /> */}
            </EmptyData>
          )}

          {/* <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '720px' }}>
          {finishedPools?.length > 0 &&
            finishedPools.map(stakingInfo => {
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
            })}
        </AutoColumn> */}
        </PageWrapper>
      </PageContainer>
    </>
  )
}
