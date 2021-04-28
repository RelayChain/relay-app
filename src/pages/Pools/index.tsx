import { ButtonOutlined, ButtonPrimary } from '../../components/Button'
import { ExternalLink, StyledInternalLink, TYPE } from '../../theme'
import React, { useEffect, useState } from 'react'
import { STAKING_REWARDS_INFO, useStakingInfo } from '../../state/stake/hooks'
import styled, { keyframes } from 'styled-components'

import Bubble from './../../components/Bubble'
import ClaimRewardModal from '../../components/pools/ClaimRewardModal'
import PageContainer from './../../components/PageContainer'
import PoolCard from '../../components/pools/PoolCard'
import PoolControls from '../../components/pools/PoolControls'
import PoolRow from '../../components/pools/PoolRow'
import { RowBetween } from '../../components/Row'
import WalletMissing from '../../assets/svg/wallet_missing.svg'
import { Zap } from 'react-feather'
import ZeroIcon from '../../assets/svg/zero_icon.svg'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import useWindowDimensions from './../../hooks/useWindowDimensions'
import { getAllPoolsAPY } from 'api'

const numeral = require('numeral');

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

const StatsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 2rem;
  background: rgba(0,0,0,.25);
  border-radius: 24px;
  margin-bottom: 1.5rem;
  .add-liquidity-link {
    width: 160px;
    margin-left: auto;
    text-decoration: none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  .add-liquidity-link {
    margin-left: auto;
    margin-right: auto;
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
    opacity: .75;
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
    opacity: .75;
    font-weight: normal;
    font-size: 1.25rem;
  }
`

export default function Pools() {
   //@ts-ignore
  const serializePoolControls = JSON.parse(localStorage.getItem('PoolControls'));
  const { width } = useWindowDimensions()
  const isColumn = width < 1500
  const { account, chainId } = useActiveWeb3React()
  const stakingInfos = useStakingInfo()
  const toggleWalletModal = useWalletModalToggle()
  const [displayMode, setDisplayMode] = useState(localStorage.getItem('PoolControls') ? serializePoolControls.displayMode : 'table')
  const [searchText, setSearchText] = useState('')
  
  const stakingInfosWithBalance = stakingInfos.filter(x => x.active)
  const finishedPools = stakingInfos.filter(x => !x.active)
  
  // filters & sorting
  const [showFinished, setShowFinished] = useState(localStorage.getItem('PoolControls') ? serializePoolControls.isActive : false);
  const [showStaked, setShowStaked] = useState(localStorage.getItem('PoolControls') ? serializePoolControls.isStaked : false)
  let arrayToShow: any[] = []
  let searchedArrayToShow: any
  // live or finished pools?
  if (!showFinished && stakingInfosWithBalance && stakingInfosWithBalance.length > 0) {
    arrayToShow = stakingInfosWithBalance
  } else if (showFinished && finishedPools && finishedPools.length > 0) {
    arrayToShow = finishedPools
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
      return items;
    }
    return items.filter(item => {
      const firstCurrencySymbol = unwrappedToken(item.tokens[0], chainId)
      const secondCurrencySymbol = unwrappedToken(item.tokens[1], chainId)

      if (firstCurrencySymbol.symbol && secondCurrencySymbol.symbol) {
        if (
          firstCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1 ||
          secondCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1
        ) {
          return item
        }
      }
    })
  }

  const [apyData, setApyData] = useState([])
  const [weeklyEarnings, setWeeklyEarnings] = useState({})
  const [readyForHarvest, setReadyForHarvest] = useState({})
  const [totalLiquidity, setTotalLiquidity] = useState({})
  const [statsDisplay, setStatsDisplay] = useState<any>({})

  const onSendDataUp = ({ singleWeeklyEarnings, readyToHarvest, liquidityValue, contract }: any) => {
    setWeeklyEarnings({ ...weeklyEarnings, [contract]: singleWeeklyEarnings });
    setReadyForHarvest({ ...readyForHarvest, [contract]: readyToHarvest });
    if (parseFloat(liquidityValue) !== 0) {
      setTotalLiquidity({ ...totalLiquidity, [contract]: liquidityValue });
    }
  }

   //  APR 
    const fakeData = [
      {
          "APY": 50.13,
          "name": "ZERO / AVAX",
          "chain": "AVA",
          "contract_addr": "0x45eD4A1f9D573A6bFec9B9fDCE2954aDD62D8e77"
      },
      {
          "APY": 116.31,
          "name": "ZERO / ETH",
          "chain": "AVA",
          "contract_addr": "0x869bE5d543226e0Cda93416aaC093b472c99c3A8"
      },
      {
          "APY": 198.27,
          "name": "ZERO / USDC",
          "chain": "AVA",
          "contract_addr": "0x617EE464d13F871FAdd6d3BE428cf452299F7a3b"
      },
      {
          "APY": 279.14,
          "name": "ZERO / USDT",
          "chain": "AVA",
          "contract_addr": "0xA8AA762a6529d7A875d0195FAd8572aAd5c697bC"
      },
      {
          "APY": 266.76,
          "name": "ZERO / WBTC",
          "chain": "AVA",
          "contract_addr": "0x1CD4C57f93784a4aba52B86a01E5d821B352BA73"
      },
      {
          "APY": 283.93,
          "name": "ZERO / UNI",
          "chain": "AVA",
          "contract_addr": "0xcE64d9454246e690e005AC6371aF9FeD88134425"
      },
      {
          "APY": 326.16,
          "name": "ZERO / SUSHI",
          "chain": "AVA",
          "contract_addr": "0x46609d1A08fAd26A52f4D84bB58523C6598352a5"
      },
      {
          "APY": 264.32,
          "name": "ZERO / DAI",
          "chain": "AVA",
          "contract_addr": "0xAfE2d3154bd3eC5601b610145923cb0ECA1937De"
      },
      {
          "APY": 136.41,
          "name": "ZERO / BNB",
          "chain": "BSC",
          "contract_addr": "0xE3200B7905559D173eed3E8EBFAd05Ac3E0c438E"
      },
      {
          "APY": 133.52,
          "name": "ZERO / ETH",
          "chain": "BSC",
          "contract_addr": "0x28EE88457DcfC66B6e2A661Ed5C10866e3615BB9"
      },
      {
          "APY": 243.29,
          "name": "ZERO / USDC",
          "chain": "BSC",
          "contract_addr": "0x0Ff36b5F7B87Bb61BE8305F9b47c83910560DF95"
      },
      {
          "APY": 295.77,
          "name": "ZERO / USDT",
          "chain": "BSC",
          "contract_addr": "0xacE237D2cC182E8c1E3866509b800Fe35e192108"
      },
      {
          "APY": 262.69,
          "name": "ZERO / WBTC",
          "chain": "BSC",
          "contract_addr": "0x9c13B95F92F4b35DC725c5d4D5e3ffa467e58091"
      },
      {
          "APY": 286.86,
          "name": "ZERO / UNI",
          "chain": "BSC",
          "contract_addr": "0x300b7ae70C9a8AA3643d4b9Ac90145c8dbd5a961"
      },
      {
          "APY": 372.72,
          "name": "ZERO / SUSHI",
          "chain": "BSC",
          "contract_addr": "0x8C0e0d72b29e51518034536fd509c9c1F5306B2d"
      },
      {
          "APY": 293.95,
          "name": "ZERO / DAI",
          "chain": "BSC",
          "contract_addr": "0xa8630279dBFb97a92a7C477c17FF4466b619A3d2"
      },
      {
          "APY": 222.88,
          "name": "ZERO / BUSD",
          "chain": "BSC",
          "contract_addr": "0xf95F7c701db4866d6C672527db65730E26AA820d"
      },
      {
          "APY": 72.49,
          "name": "ZERO / ETH",
          "chain": "ETH",
          "contract_addr": "0x6c32Eac6Cc240d507aC88ca73183c5CcC135b09C"
      },
      {
          "APY": 297.46,
          "name": "ZERO / USDC",
          "chain": "ETH",
          "contract_addr": "0xdAD63CBa8c4b42255e7b7055FC48435316c55E25"
      },
      {
          "APY": 183.73,
          "name": "ZERO / USDT",
          "chain": "ETH",
          "contract_addr": "0xe5cFc90521477f9DeA4784Cc96f0230bFFe82108"
      },
      {
          "APY": 286.79,
          "name": "ZERO / WBTC",
          "chain": "ETH",
          "contract_addr": "0x3C775c9f57e614b11263441968Fac2d70673301a"
      },
      {
          "APY": 320.16,
          "name": "ZERO / UNI",
          "chain": "ETH",
          "contract_addr": "0x8161fBcc80a2526BCf5E5207ED18b2A26dF6807D"
      },
      {
          "APY": 315.07,
          "name": "ZERO / SUSHI",
          "chain": "ETH",
          "contract_addr": "0xDF085d8c554018540Bbfc3123FbD8BaaC620c2Fa"
      },
      {
          "APY": 313.05,
          "name": "ZERO / DAI",
          "chain": "ETH",
          "contract_addr": "0x8995fcD45B13BF75f9FA65BbBC6A75066E4E9Cbf"
      }
  ]
  
  const getAllAPY = async () => {
    const res = await getAllPoolsAPY()
    if (!res.hasError) {
      setApyData(res?.data)
    }
  }

 
  useEffect(() => {
    getAllAPY()
    let earnings: any = 0;
    let harvest: any = 0;
    Object.keys(weeklyEarnings).forEach((key) => {
      earnings = earnings + parseFloat(weeklyEarnings[key].replace(/,/g, ''));
    });
    Object.keys(readyForHarvest).forEach((key) => {
      harvest = harvest + parseFloat(readyForHarvest[key].replace(/,/g, ''));
    });
    setStatsDisplay({ earnings, harvest });
    if (serializePoolControls && serializePoolControls.filteredMode) {
      handleSelectFilter(serializePoolControls.filteredMode)
    }
    arrayToShow.forEach((arrItem, index) => {
      fakeData.forEach(dataItem => {
        if (dataItem.contract_addr === arrItem.stakingRewardAddress) {
          arrayToShow[index]['APR'] = dataItem.APY
        }
      })
    })
  }, [weeklyEarnings, readyForHarvest])

  const [showClaimRewardModal, setShowClaimRewardModal] = useState<boolean>(false)
  const [claimRewardStaking, setClaimRewardStaking] = useState<any>(null)

  const handleHarvest = (stakingInfo: any) => {
    setClaimRewardStaking(stakingInfo)
    setShowClaimRewardModal(true)
  }

  // filter array by staked
  let filteredArray = arrayToShow.filter(x => readyForHarvest[x.stakingRewardAddress] !== undefined && parseFloat(readyForHarvest[x.stakingRewardAddress]) !== 0);
  let visibleItems: any = searchItems(showStaked ? filteredArray : arrayToShow, searchText)
  
  // lastly, if there is a sort, sort
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const handleSelectFilter = (val: string) => {
    setSelectedFilter(val);
  }

  const filterItems = (str: string) => {
    switch(str) {
      case 'earned':
        return visibleItems.sort((a: any, b: any) => {
          const aVal = parseFloat(readyForHarvest[a.stakingRewardAddress]) || 0;
          const bVal = parseFloat(readyForHarvest[b.stakingRewardAddress]) || 0;
          return bVal - aVal;
        });
      case 'liquidity':
        return visibleItems.sort((a: any, b: any) => {
          const aVal = parseFloat(totalLiquidity[a.stakingRewardAddress]) || 0;
          const bVal = parseFloat(totalLiquidity[b.stakingRewardAddress]) || 0;
          return bVal - aVal;
        });
      case 'apr':
        return visibleItems.sort((a: any, b: any) => {
          return b.APR - a.APR
        });
      default: return visibleItems;
    }
  }

  if (selectedFilter) {
    visibleItems = filterItems(selectedFilter);
  }

  return (
    <>
      {claimRewardStaking && (
        <>
          <ClaimRewardModal
            isOpen={showClaimRewardModal}
            onDismiss={() => { setShowClaimRewardModal(false); setClaimRewardStaking(null); }}
            stakingInfo={claimRewardStaking}
          />
        </>
      )}
      <Title>Pools</Title>
      <PageContainer>

        <StatsWrapper>
          <Stat className="weekly">
            <StatLabel>Weekly Earnings:</StatLabel>
            <StatValue>{numeral(statsDisplay?.earnings).format('0,0.00')} <span>ZERO</span></StatValue>
          </Stat>
          <Stat className="harvest">
            <StatLabel>Ready To Harvest:</StatLabel>
            <StatValue>{numeral(statsDisplay?.harvest).format('0,0.00')} <span>ZERO</span></StatValue>
          </Stat>
          <StyledInternalLink className="add-liquidity-link"
            to={{
              pathname: `/add`,
            }}
          >
            <ButtonOutlined className="add-liquidity-button">Add Liquidity</ButtonOutlined>
          </StyledInternalLink>
        </StatsWrapper>

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
              onSelectFilter={handleSelectFilter}
              setShowStaked={() => setShowStaked(!showStaked)}
            />
          )}
          {account !== null &&
            stakingInfos?.length > 0 && visibleItems?.length > 0 &&
            (displayMode === 'table' ? (
              <Wrapper>
                <PoolsTable style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ verticalAlign: 'top', height: '30px' }}>
                      <HeaderCell style={{ width: '45px'}}></HeaderCell>
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
                      <HeaderCell style={{ width: '45px'}}></HeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleItems?.map((stakingInfo: any) => {
                      // need to sort by added liquidity here
                      return <PoolRow
                                onHarvest={() => handleHarvest(stakingInfo)}
                                harvestSent={readyForHarvest[stakingInfo.stakingRewardAddress]}
                                earningsSent={weeklyEarnings[stakingInfo.stakingRewardAddress]}
                                liquiditySent={totalLiquidity[stakingInfo.stakingRewardAddress]}
                                key={stakingInfo.stakingRewardAddress}
                                stakingInfoTop={stakingInfo}
                                stakingInfoAPR={stakingInfo.APR}
                                sendDataUp={onSendDataUp}
                                showStaked={showStaked}/>
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
                {visibleItems?.map((stakingInfo: any) => {
                  return <PoolCard
                          onHarvest={() => handleHarvest(stakingInfo)}
                          harvestSent={readyForHarvest[stakingInfo.stakingRewardAddress]}
                          earningsSent={weeklyEarnings[stakingInfo.stakingRewardAddress]}
                          liquiditySent={totalLiquidity[stakingInfo.stakingRewardAddress]}
                          key={stakingInfo.stakingRewardAddress}
                          stakingInfoTop={stakingInfo}
                          stakingInfoAPR={stakingInfo.APR}
                          sendDataUp={onSendDataUp}
                          showStaked={showStaked} />
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
