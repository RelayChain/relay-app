import { ExternalLink, TYPE } from '../../theme'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'

import { AutoColumn } from '../../components/Column'
import { ButtonSecondary } from '../../components/Button'
import { ChainId } from '@zeroexchange/sdk'
import { Countdown } from './Countdown'
import { DataCard } from '../../components/earn/styled'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import { OutlineCard } from '../../components/Card'
import PoolCard from '../../components/earn/PoolCard'
import PoolRow from '../../components/earn/PoolRow'
import React , {useState} from 'react'
import { RowBetween } from '../../components/Row'
import { Zap } from 'react-feather'
import styled, { keyframes } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import CardMode from '../../assets/svg/CardMode'
import ListMode from '../../assets/svg/ListMode'
import ZeroIcon from '../../assets/svg/zero_icon.svg'
import WalletMissing from '../../assets/svg/wallet_missing.svg'
import NoResults from '../../assets/svg/no_results.svg'
import { ButtonPrimary, ButtonOutlined } from '../../components/Button'

import Select from '../../components/Select'
import SearchBar from '../../components/SearchBar'
import { useWalletModalToggle } from '../../state/application/hooks'

const PageWrapper = styled.div`
  flex-direction: column;
  display: flex;
  padding: 0px 64px;
  width: 100%;
  flex-grow: 1;
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
const Controls = styled.div`
  display: flex;
  margin-bottom: 20px;
`
const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  margin-right: 32px;
  &:last-of-type {
    margin-right: 0px;
  }
`
const ControlLabel = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-right: 20px;
  flex-wrap: nowrap;
`
const InputContainer = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0px 8px;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(28px);
  border-radius: 44px;
`
const Button = styled.button`
  width: 40px;
  height: 40px;
  background: none;
  border: 0px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
  &:hover {
    svg {
      g {
        fill: #ffffff;
      }
    }
  }
  svg {
    g {
      fill: #727bba;
    }
  }
`

const LayoutToggle = styled.div``
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
export default function Pools() {
  // get chainId
  const { account, chainId } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [searchText, setSearchText] = useState('')
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
        <Title>Pools</Title>
        {account !== null && (
          <Controls>
            <ControlGroup>
              <SearchBar
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <TYPE.main fontWeight={600} fontSize={12}>
                  {`Sort by: `}
                </TYPE.main>
              </ControlLabel>
              <Select
                options={[
                  {
                    label: 'Hot',
                    value: 'hot'
                  },
                  {
                    label: 'APR',
                    value: 'apr'
                  },
                  {
                    label: 'Multiplier',
                    value: 'multiplier'
                  },
                  {
                    label: 'Earned',
                    value: 'earned'
                  },
                  {
                    label: 'Liquidity',
                    value: 'liquidity'
                  }
                ]}
                onChange={() => {}}
              />
            </ControlGroup>

            <ControlGroup>
              <ControlLabel>
                <TYPE.main fontWeight={600} fontSize={12}>
                  {`Mode: `}
                </TYPE.main>
              </ControlLabel>
              <InputContainer>
                <Button>
                  <ListMode />
                </Button>
                <Button>
                  <CardMode />
                </Button>
              </InputContainer>
            </ControlGroup>
          </Controls>
        )}
        {account !== null && stakingInfos?.length > 0 && (
          <Wrapper>
            <PoolsTable style={{ width: '100%' }}>
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
            </PoolsTable>
            {/* : !stakingRewardsExist ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : stakingInfos?.length !== 0 && stakingInfosWithBalance.length === 0 ? (
            <OutlineCard>No active pools</OutlineCard>
          ) : null} */}
          </Wrapper>
        )}
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
          {finishedPools?.length > 0 && (
            <DataRow style={{ alignItems: 'baseline' }}>
              <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Closed pools:</TYPE.mediumHeader>
            </DataRow>
          )}
          {finishedPools?.length > 0 &&
            finishedPools.map(stakingInfo => {
              return <PoolCard key={stakingInfo.stakingRewardAddress} stakingInfoTop={stakingInfo} />
            })}
        </AutoColumn> */}
      </PageWrapper>
    </>
  )
}
