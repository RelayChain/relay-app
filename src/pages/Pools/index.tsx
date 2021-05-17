import { CustomLightSpinner, StyledInternalLink, TYPE, Title } from '../../theme'
import React, { useEffect, useMemo, useState } from 'react'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import { setOptions, filterPoolsItems, searchItems } from 'utils/sortPoolsPage'
import styled, { keyframes } from 'styled-components'

import { AppDispatch } from '../../state'
import { ButtonOutlined } from '../../components/Button'
import Circle from '../../assets/images/blue-loader.svg'
import ClaimRewardModal from '../../components/pools/ClaimRewardModal'
import { Countdown } from './Countdown'
import DropdownArrow from './../../assets/svg/DropdownArrow'
import { NoWalletConnected } from '../../components/NoWalletConnected'
import PageContainer from './../../components/PageContainer'
import PoolCard from '../../components/pools/PoolCard'
import PoolControls from '../../components/pools/PoolControls'
import PoolRow from '../../components/pools/PoolRow'
import ZeroIcon from '../../assets/svg/zero_icon.svg'
import { getAllPoolsAPY } from 'api'
import { setAprData, setPoolsData, AprObjectProps, setToggle, setStackingInfo } from './../../state/pools/actions'
import { useActiveWeb3React } from '../../hooks'
import { useDispatch } from 'react-redux'
import { usePoolsState } from './../../state/pools/hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { CgArrowsExpandDownLeft } from 'react-icons/cg'

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

export type SortedTitleProps = {
  title: String
}

export default function Pools() {
  //@ts-ignore
  const serializePoolControls = JSON.parse(localStorage.getItem('PoolControls')) //get filter data from local storage
  const dispatch = useDispatch<AppDispatch>()
  const aprAllData = usePoolsState()
  const { aprData, poolsData, isTouchable, poolStackingInfo } = aprAllData
  const { account, chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const toggleWalletModal = useWalletModalToggle()

  // filters & sorting
  const [searchText, setSearchText] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls.searchText : ''
  )
  const [isStaked, setShowStaked] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls.isStaked : false
  )
  const [isLive, setShowLive] = useState(localStorage.getItem('PoolControls') ? serializePoolControls.isLive : true)
  const [filteredMode, setFilteredMode] = useState(
    localStorage.getItem('PoolControls') ? serializePoolControls?.filteredMode : 'Hot'
  )
  const [displayMode, setDisplayMode] = useState(
    localStorage.getItem('PoolControls') && serializePoolControls?.displayMode
      ? serializePoolControls?.displayMode
      : 'table'
  )

  const [showClaimRewardModal, setShowClaimRewardModal] = useState<boolean>(false)
  const [claimRewardStaking, setClaimRewardStaking] = useState<any>(null)
  const [weeklyEarnings, setWeeklyEarnings] = useState({})
  const [readyForHarvest, setReadyForHarvest] = useState({})
  const [totalLiquidity, setTotalLiquidity] = useState({})
  const [statsDisplay, setStatsDisplay] = useState<any>({})

  const stakingInfosWithBalance = stakingInfos.filter(x => x.active)
  const finishedPools = stakingInfos.filter(x => !x.active)

  const [apyRequested, setApyRequested] = useState(false)
  const getAllAPY = async () => {
    const res = await getAllPoolsAPY()
    setApyRequested(true)
    if (!res.hasError) {
      dispatch(setAprData({ aprData: res?.data }))
      setApyRequested(false)
    }
  }

  let arrayToShow: any[] = []

  const setArrayToShow = () => {
    !aprData.length && getAllAPY()
    //  APR
    if (aprData && aprData.length) {
      stakingInfos.forEach(arrItem => {
        aprData.forEach((dataItem: AprObjectProps) => {
          if (dataItem?.contract_addr === arrItem.stakingRewardAddress && !arrItem['APR']) {
            arrItem['APR'] = dataItem.APY
          }
        })
      })
    }
    arrayToShow = filterPoolsItems(stakingInfos, isLive, isStaked, readyForHarvest, filteredMode, totalLiquidity)
  }

  if (!poolsData.length || isTouchable) {
    setArrayToShow()
  }
  // lastly, if there is a sort, sort
  arrayToShow = searchItems(poolsData.length && !isTouchable ? poolsData : arrayToShow, searchText, chainId)

  useEffect(() => {
    ;(!poolsData.length || isTouchable) && dispatch(setPoolsData({ poolsData: arrayToShow }))
    dispatch(setToggle({ isTouchable: true }))
    let earnings: any = 0
    let harvest: any = 0
    Object.keys(weeklyEarnings).forEach(key => {
      earnings = earnings + parseFloat(weeklyEarnings[key].replace(/,/g, ''))
    })
    Object.keys(readyForHarvest).forEach(key => {
      harvest = harvest + parseFloat(readyForHarvest[key].replace(/,/g, ''))
    })
    setStatsDisplay({ earnings, harvest })
    setFilteredMode(filteredMode)
    dispatch(setToggle({ isTouchable: false }))
  }, [weeklyEarnings, readyForHarvest, filteredMode, stakingInfos, isTouchable, aprData])

  // toggle copy if rewards are inactive
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0)

  const onSendDataUp = ({ singleWeeklyEarnings, readyToHarvest, liquidityValue, contract }: any) => {
    setWeeklyEarnings({ ...weeklyEarnings, [contract]: singleWeeklyEarnings })
    setReadyForHarvest({ ...readyForHarvest, [contract]: readyToHarvest })
    if (parseFloat(liquidityValue) !== 0) {
      setTotalLiquidity({ ...totalLiquidity, [contract]: liquidityValue })
    }
  }

  const handleHarvest = (stakingInfo: any) => {
    setClaimRewardStaking(stakingInfo)
    setShowClaimRewardModal(true)
  }

  const onSortChange = (key: string, value: string | boolean) => {
    switch (key) {
      case 'searchText':
        setSearchText(value)
        break
      case 'isStaked':
        setShowStaked(value)
        break
      case 'isLive':
        setShowLive(value)
        break
      case 'filteredMode':
        setFilteredMode(value)
        break
      case 'displayMode':
        setDisplayMode(value)
        break
    }
    const clone = { ...serializePoolControls, [key]: value }
    localStorage.setItem('PoolControls', JSON.stringify(clone))
    dispatch(setToggle({ isTouchable: true }))
  }

  const SortedTitle = ({ title }: SortedTitleProps) => (
    <HeaderCellSpan>
      {title}
      {title === filteredMode && (
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
      {!arrayToShow || (apyRequested && <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />)}
      <PageContainer>
        {account !== null && arrayToShow?.length > 0 && aprData?.length > 0 && !apyRequested && (
          <StatsWrapper>
            <Stat className="weekly">
              <StatLabel>Weekly Earnings:</StatLabel>
              <StatValue>
                {numeral(statsDisplay?.earnings).format('0,0.00')} <span>Tokens</span>
              </StatValue>
            </Stat>
            <Stat className="harvest">
              <StatLabel>Ready To Harvest:</StatLabel>
              <StatValue>
                {numeral(statsDisplay?.harvest).format('0,0.00')} <span>Tokens</span>
              </StatValue>
            </Stat>
            <StyledInternalLink className="add-liquidity-link" to={{ pathname: `/add` }}>
              <ButtonOutlined className="add-liquidity-button">Add Liquidity</ButtonOutlined>
            </StyledInternalLink>
            <StyledInternalLink className="remove-liquidity-link" to={{ pathname: `/remove` }}>
              <TextLink>Remove Liquidity</TextLink>
            </StyledInternalLink>
          </StatsWrapper>
        )}
        <PageWrapper>
          {account !== null && (
            <PoolControls
              isLive={isLive}
              displayMode={displayMode}
              searchText={searchText}
              onSortChange={onSortChange}
              isStaked={isStaked}
              options={setOptions(filteredMode)}
              activeFilteredMode={filteredMode}
            />
          )}
          {account !== null &&
            stakingInfos?.length > 0 &&
            arrayToShow?.length > 0 &&
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
                        onClick={() => onSortChange('filteredMode', 'APR')}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="APR" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell
                        style={{ cursor: 'pointer' }}
                        mobile={false}
                        onClick={() => onSortChange('filteredMode', 'Liquidity')}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="Liquidity" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell
                        style={{ cursor: 'pointer' }}
                        mobile={false}
                        onClick={() => onSortChange('filteredMode', 'Earned')}
                      >
                        <TYPE.main fontWeight={600} fontSize={12}>
                          <SortedTitle title="Earned" />
                        </TYPE.main>
                      </HeaderCell>
                      <HeaderCell style={{ width: '150px' }}>
                        <TYPE.main fontWeight={600} fontSize={12} style={{ textAlign: 'left', paddingLeft: '20px' }}>
                          Ending:
                        </TYPE.main>
                      </HeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {arrayToShow?.map((item: any) => {
                      if (!item) {
                        return <></>
                      }
                      return (
                        <PoolRow
                          onHarvest={() => handleHarvest(item)}
                          harvestSent={readyForHarvest[item.stakingRewardAddress]}
                          earningsSent={weeklyEarnings[item.stakingRewardAddress]}
                          liquiditySent={totalLiquidity[item.stakingRewardAddress]}
                          key={item.stakingRewardAddress}
                          stakingInfoTop={item}
                          stakingInfoAPR={item.APR}
                          sendDataUp={onSendDataUp}
                        />
                      )
                    })}
                  </tbody>
                </PoolsTable>
              </Wrapper>
            ) : (
              <GridContainer>
                {arrayToShow?.map((item: any) => {
                  if (!item) {
                    return <></>
                  }
                  return (
                    <PoolCard
                      onHarvest={() => handleHarvest(item)}
                      harvestSent={readyForHarvest[item.stakingRewardAddress]}
                      earningsSent={weeklyEarnings[item.stakingRewardAddress]}
                      liquiditySent={totalLiquidity[item.stakingRewardAddress]}
                      key={item.stakingRewardAddress}
                      stakingInfoTop={item}
                      stakingInfoAPR={item.APR}
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
          {account === null && <NoWalletConnected handleWalletModal={toggleWalletModal} />}
        </PageWrapper>
      </PageContainer>
    </>
  )
}
