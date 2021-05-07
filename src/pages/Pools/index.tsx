import { ButtonOutlined, ButtonPrimary } from '../../components/Button'
import React, { useEffect, useState } from 'react'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import styled, { keyframes } from 'styled-components'

import ClaimRewardModal from '../../components/pools/ClaimRewardModal'
import DropdownArrow from './../../assets/svg/DropdownArrow'
import PageContainer from './../../components/PageContainer'
import PoolCard from '../../components/pools/PoolCard'
import PoolControls from '../../components/pools/PoolControls'
import PoolRow from '../../components/pools/PoolRow'
import WalletMissing from '../../assets/svg/wallet_missing.svg'
import ZeroIcon from '../../assets/svg/zero_icon.svg'
import { arrayMove } from '../../utils/arrayMove'
import { getAllPoolsAPY } from 'api'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import useWindowDimensions from './../../hooks/useWindowDimensions'

const numeral = require('numeral')

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
  padding: 30px 0;
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
  :last-child {
    width: 45px;
  }
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

const TextLink = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #6752f7;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &.pink {
    color: #b368fc;
  }
  &:hover {
    opacity: 0.9;
  }
`

// Here we create a component that will rotate everything we pass in over two seconds
const Spinner = styled.img`
  width: 100px;
  height: auto;
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

const StatsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  .add-liquidity-link {
    width: 160px;
    margin-left: auto;
    text-decoration: none;
  }
  .remove-liquidity-link {
    text-decoration: none;
    margin-left: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: flex-start;
  .add-liquidity-link {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 500px;
  }
  .remove-liquidity-link {
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }
`};
`
const Stat = styled.div`
  display: flex;
  flex-grow: 0;
  flex-direction: column;
  &.harvest {
    margin-left: 2rem;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  &.harvest {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 0;
  }
`};
`

const StatLabel = styled.h5`
  font-weight: bold;
  color: #fff;
  font-size: 1rem;
  span {
    opacity: 0.75;
    font-weight: normal;
  }
`

const StatValue = styled.h6`
  font-weight: bold;
  color: #fff;
  font-size: 1.75rem;
  margin-top: 10px;
  margin-bottom: 0;
  span {
    opacity: 0.75;
    font-weight: normal;
    font-size: 1.25rem;
  }
`
const DropDownWrap = styled.span`
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: '1px';

  svg {
    width: 10px;
    g {
      fill: rgba(179, 104, 252, 1);
    }
  }
`

const HeaderCellSpan = styled.span`
  position: relative;
`

export type APYObjectProps = {
  APY: number
  name: String
  chain: String
  contract_addr: String
}

export type SortedTitleProps = {
  title: String
  sortedMode: String
}

export default function Pools() {
  //@ts-ignore
  const serializePoolControls = JSON.parse(localStorage.getItem('PoolControls'))
  const { width } = useWindowDimensions()
  const { account, chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  console.log(stakingInfos)
  const toggleWalletModal = useWalletModalToggle()
  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem('PoolControls') && serializePoolControls?.displayMode
      ? serializePoolControls?.displayMode
      : 'table'
  )
  const [searchText, setSearchText] = useState('')

  const stakingInfosWithBalance = stakingInfos.filter(x => x.active)
  const finishedPools = stakingInfos.filter(x => !x.active)

  // filters & sorting
  const [showFinished, setShowFinished] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls.isActive : false
  )
  const [showStaked, setShowStaked] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls.isStaked : false
  )

  let arrayToShow: any[] = []

  // live or finished pools?
  if (!showFinished && stakingInfosWithBalance && stakingInfosWithBalance.length > 0) {
    arrayToShow = stakingInfos.map(x => (x.active ? x : { ...x, isHidden: true }))
  } else if (showFinished && finishedPools && finishedPools.length > 0) {
    arrayToShow = stakingInfos.map(x => (!x.active ? x : { ...x, isHidden: true }))
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

  const searchItems = (items: any[], term: string) => {
    if (term.length == 0 || term === '' || term.trim().length === 0) {
      return items
    }
    return items.map(item => {
      const firstCurrencySymbol = unwrappedToken(item.tokens[0], chainId)
      const secondCurrencySymbol = unwrappedToken(item.tokens[1], chainId)

      if (firstCurrencySymbol.symbol && secondCurrencySymbol.symbol) {
        if (
          firstCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1 ||
          secondCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1
        ) {
          return item
        }
      } else {
        return { ...item, isHidden: true }
      }
    })
  }

  const [apyData, setApyData] = useState([{}])
  const [weeklyEarnings, setWeeklyEarnings] = useState({})
  const [readyForHarvest, setReadyForHarvest] = useState({})
  const [totalLiquidity, setTotalLiquidity] = useState({})
  const [statsDisplay, setStatsDisplay] = useState<any>({})

  const onSendDataUp = ({ singleWeeklyEarnings, readyToHarvest, liquidityValue, contract }: any) => {
    setWeeklyEarnings({ ...weeklyEarnings, [contract]: singleWeeklyEarnings })
    setReadyForHarvest({ ...readyForHarvest, [contract]: readyToHarvest })
    if (parseFloat(liquidityValue) !== 0) {
      setTotalLiquidity({ ...totalLiquidity, [contract]: liquidityValue })
    }
  }

  //  APR
  if (apyData && apyData.length) {
    arrayToShow.forEach((arrItem, index) => {
      //@ts-ignore
      apyData.forEach((dataItem: APYObjectProps) => {
        if (dataItem?.contract_addr === arrItem.stakingRewardAddress) {
          arrayToShow[index]['APR'] = dataItem.APY
        }
      })
    })
  }

  const [apyRequested, setApyRequested] = useState(false)
  const getAllAPY = async () => {
    if (!apyRequested) {
      setApyRequested(true)
      const res = await getAllPoolsAPY()
      if (!res.hasError) {
        setApyData(res?.data)
      }
    }
  }

  getAllAPY()

  useEffect(() => {
    let earnings: any = 0
    let harvest: any = 0
    Object.keys(weeklyEarnings).forEach(key => {
      earnings = earnings + parseFloat(weeklyEarnings[key].replace(/,/g, ''))
    })
    Object.keys(readyForHarvest).forEach(key => {
      harvest = harvest + parseFloat(readyForHarvest[key].replace(/,/g, ''))
    })
    setStatsDisplay({ earnings, harvest })
    if (serializePoolControls && serializePoolControls?.sortedMode) {
      handleSelectSort(serializePoolControls?.sortedMode)
    }
  }, [weeklyEarnings, readyForHarvest, serializePoolControls?.sortedMode])

  const [showClaimRewardModal, setShowClaimRewardModal] = useState<boolean>(false)
  const [claimRewardStaking, setClaimRewardStaking] = useState<any>(null)

  const handleHarvest = (stakingInfo: any) => {
    setClaimRewardStaking(stakingInfo)
    setShowClaimRewardModal(true)
  }

  // filter array by staked
  if (showStaked) {
    arrayToShow = arrayToShow.map(item => {
      if (readyForHarvest[item.stakingRewardAddress] !== undefined && Boolean(item?.stakedAmount?.greaterThan('0'))) {
        return item
      } else {
        return { ...item, isHidden: true }
      }
    })
  } else {
    arrayToShow
      .sort((a, b) => parseFloat(b?.stakedAmount?.toSignificant(6)) - parseFloat(a?.stakedAmount?.toSignificant(6)))
      .sort(
        (a, b) =>
          parseFloat(readyForHarvest[b?.stakingRewardAddress]) - parseFloat(readyForHarvest[a?.stakingRewardAddress])
      )
  }

  // search items
  let visibleItems: any = searchItems(arrayToShow, searchText)

  // lastly, if there is a sort, sort
  const [selectedSort, setSelectedSort] = useState<string | null>(null)
  const handleSelectSort = (val: string) => {
    setSelectedSort(val)
  }

  const sortItems = (str: string) => {
    switch (str) {
      case 'earned':
        return visibleItems.sort((a: any, b: any) => {
          const aVal = parseFloat(readyForHarvest[a.stakingRewardAddress]) || 0
          const bVal = parseFloat(readyForHarvest[b.stakingRewardAddress]) || 0
          return bVal - aVal
        })
      case 'liquidity':
        return visibleItems.sort((a: any, b: any) => {
          const aVal = parseFloat(totalLiquidity[a.stakingRewardAddress]) || 0
          const bVal = parseFloat(totalLiquidity[b.stakingRewardAddress]) || 0
          return bVal - aVal
        })
      case 'apr':
        return visibleItems.sort((a: any, b: any) => {
          return (b.APR || 0) - (a.APR || 0)
        })
      default:
        return visibleItems
    }
  }

  if (selectedSort) {
    visibleItems = sortItems(selectedSort)
  }

  const [filteredMode, setFilteredMode] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls?.sortedMode : 'hot'
  )
  const defaultOptions = [
    {
      label: 'Hot',
      value: 'hot'
    },
    {
      label: 'APR',
      value: 'apr'
    },
    {
      label: 'Earned',
      value: 'earned'
    },
    {
      label: 'Liquidity',
      value: 'liquidity'
    }
  ]

  const setStartOptions = (str: string) => {
    switch (str) {
      case 'liquidity':
        return arrayMove(defaultOptions, 3, 0)
      case 'hot':
        return defaultOptions
      case 'apr':
        return arrayMove(defaultOptions, 1, 0)
      case 'earned':
        return arrayMove(defaultOptions, 2, 0)
      default:
        return defaultOptions
    }
  }
  let data: any
  //@ts-ignore
  if (JSON.parse(localStorage.getItem('PoolControls'))) {
    //@ts-ignore
    data = setStartOptions(JSON.parse(localStorage.getItem('PoolControls')).sortedMode)
  }

  const onSortedChange = (sortedMode: string) => {
    setFilteredMode(sortedMode)
    const clone = { ...serializePoolControls, sortedMode: sortedMode }
    localStorage.setItem('PoolControls', JSON.stringify(clone))
  }

  const SortedTitle = ({ title, sortedMode }: SortedTitleProps) => (
    <HeaderCellSpan>
      {title}
      {filteredMode === sortedMode && (
        <DropDownWrap>
          <DropdownArrow />
        </DropDownWrap>
      )}
    </HeaderCellSpan>
  )

  return (
    <>
      {claimRewardStaking && (
        <>
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => {
              setShowClaimRewardModal(false)
              setClaimRewardStaking(null)
            }}
            stakingInfo={claimRewardStaking}
          />
        </>
      )}
      <Title>Pools</Title>
      <PageContainer>
        {account !== null && (
          <StatsWrapper>
            <Stat className="weekly">
              <StatLabel>Weekly Earnings:</StatLabel>
              <StatValue>
                {numeral(statsDisplay?.earnings).format('0,0.00')} <span>ZERO</span>
              </StatValue>
            </Stat>
            <Stat className="harvest">
              <StatLabel>Ready To Harvest:</StatLabel>
              <StatValue>
                {numeral(statsDisplay?.harvest).format('0,0.00')} <span>ZERO</span>
              </StatValue>
            </Stat>
            <StyledInternalLink
              className="add-liquidity-link"
              to={{
                pathname: `/add`
              }}
            >
              <ButtonOutlined className="add-liquidity-button">Add Liquidity</ButtonOutlined>
            </StyledInternalLink>
            <StyledInternalLink
              className="remove-liquidity-link"
              to={{
                pathname: `/remove`
              }}
            >
              <TextLink>Remove Liquidity</TextLink>
            </StyledInternalLink>
          </StatsWrapper>
        )}
        <PageWrapper>
          {account !== null && (
            <PoolControls
              setShowFinished={() => setShowFinished(!showFinished)}
              showFinished={showFinished}
              displayMode={displayMode}
              setDisplayMode={setDisplayMode}
              searchText={searchText}
              setSearchText={setSearchText}
              showStaked={showStaked}
              onSelectFilter={handleSelectSort}
              setShowStaked={() => setShowStaked(!showStaked)}
              setFilteredMode={setFilteredMode}
              sortedData={data || defaultOptions}
            />
          )}
          {account !== null &&
            stakingInfos?.length > 0 &&
            visibleItems?.length > 0 &&
            (displayMode === 'table' ? (
              <Wrapper>
                <PoolsTable style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ verticalAlign: 'top', height: '30px' }}>
                      <HeaderCell style={{ width: '45px' }}></HeaderCell>
                      <HeaderCell>
                        <TYPE.main fontWeight={600} fontSize={12} style={{ textAlign: 'left', paddingLeft: '20px' }}>
                          Type
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell mobile={false}>
                        <TYPE.main fontWeight={600} fontSize={12}>
                          Reward
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell
                        style={{ cursor: 'pointer' }}
                        mobile={false}
                        onClick={() => {
                          onSortedChange('apr')
                        }}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="APR" sortedMode="apr" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell
                        style={{ cursor: 'pointer' }}
                        mobile={false}
                        onClick={() => {
                          onSortedChange('liquidity')
                        }}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="Liquidity" sortedMode="liquidity" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell
                        style={{ cursor: 'pointer' }}
                        mobile={false}
                        onClick={() => {
                          onSortedChange('earned')
                        }}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="Earned" sortedMode="earned" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell style={{ width: '45px' }}></HeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems?.map((stakingInfo: any) => {
                      if (!stakingInfo) {
                        return <></>
                      }
                      return (
                        <PoolRow
                          onHarvest={() => handleHarvest(stakingInfo)}
                          harvestSent={readyForHarvest[stakingInfo.stakingRewardAddress]}
                          earningsSent={weeklyEarnings[stakingInfo.stakingRewardAddress]}
                          liquiditySent={totalLiquidity[stakingInfo.stakingRewardAddress]}
                          key={stakingInfo.stakingRewardAddress}
                          stakingInfoTop={stakingInfo}
                          stakingInfoAPR={stakingInfo.APR}
                          sendDataUp={onSendDataUp}
                        />
                      )
                    })}
                  </tbody>
                </PoolsTable>
              </Wrapper>
            ) : (
              <GridContainer>
                {visibleItems?.map((stakingInfo: any) => {
                  if (!stakingInfo) {
                    return <></>
                  }
                  return (
                    <PoolCard
                      onHarvest={() => handleHarvest(stakingInfo)}
                      harvestSent={readyForHarvest[stakingInfo.stakingRewardAddress]}
                      earningsSent={weeklyEarnings[stakingInfo.stakingRewardAddress]}
                      liquiditySent={totalLiquidity[stakingInfo.stakingRewardAddress]}
                      key={stakingInfo.stakingRewardAddress}
                      stakingInfoTop={stakingInfo}
                      stakingInfoAPR={stakingInfo.APR}
                      sendDataUp={onSendDataUp}
                    />
                  )
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
            </EmptyData>
          )}
        </PageWrapper>
      </PageContainer>
    </>
  )
}
