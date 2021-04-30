import { ButtonLight, ButtonPrimary } from 'components/Button'
import React, { useEffect, useState } from 'react'
import { getTVLData, getTVLHistory, getWalletHolderCount } from 'api'

import Bubble from './../../components/Bubble'
import BubbleChart from './../../components/BubbleChart'
import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme'
import PageContainer from './../../components/PageContainer'
import { TVLHistoryData } from './../../graphql/types'
import Transactions from './../../components/Transactions'
import getPercentageValues from '../../utils/getPercentageValues'
import styled from 'styled-components'
import transactions from '../../graphql/queries/transactions'
import { useQuery } from '@apollo/client'
import useWindowDimensions from './../../hooks/useWindowDimensions'
import zeroDayDatas from '../../graphql/queries/zeroDayDatas'
const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
padding: 0;
`};
`
const WalletsWrap = styled.div<{ isColumn: boolean }>`
  display: flex;
  justify-content: ${({ isColumn }) => (isColumn ? 'center' : 'flex-end')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 25px;
  justify-content: center;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  justify-content: space-between;
`};
`
const BubbleMarginWrap = styled.div`
  display: flex;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
 width: 100%;
 justify-content: space-between;
 align-items: center;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
 gap: 0.1rem;
`};
`
const Flex = styled.div<{ isColumn: boolean }>`
  margin: 20px auto 0;
  display: flex;
  justify-content: ${({ isColumn }) => (isColumn ? 'center' : 'space-between')};
  flex-wrap: wrap;
  gap: 4rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  margin: 40px auto 0;
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  gap: 2rem;
  margin: 20px auto 0;
`};
`
const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 1rem 0;
`
const FlexButtons = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 50px;
  margin-bottom: 4rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
`};
`
const Button = styled.div`
  width: 25%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
width:100%;
`};
`

function fnum(x: number) {
  if (isNaN(x)) return { value: x, suffix: '' }

  if (x < 9999) {
    return { value: x, suffix: '' }
  }

  if (x < 1000000) {
    return { value: x / 1000, suffix: 'K' }
  }

  if (x < 1000000000) {
    return { value: x / 1000000, suffix: 'M' }
  }

  if (x < 1000000000000) {
    return { value: x / 1000000000, suffix: 'B' }
  }

  return { value: x / 1000000000000, suffix: 'T' }
}

export default function Home() {
  const [pagination, setPagination] = useState<number>(0)
  const [walletHolderCount, setWalletHolderCount] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(26285647.16)
  const [loadingWC, setLoadingWC] = useState(true)
  const [loadingTV, setLoadingTV] = useState(true)
  const [tvlData, setTvlData] = useState<TVLHistoryData[]>([])

  const { width } = useWindowDimensions()
  const zeroData = useQuery(zeroDayDatas)
  const transactionsData = useQuery(transactions, {
    variables: {
      first: 12,
      skip: pagination * 12
    }
  })
 
  const getWalletHoldersData = async () => {
    const res = await getWalletHolderCount()
    setLoadingWC(false)
    if (!res.hasError) {
      setWalletHolderCount(res?.total)
    }
  }

  const getTVL = async () => {
    const res = await getTVLData()
    setLoadingTV(false)
    if (!res.hasError) {
      setTotalValue(res?.TVL_total_usd)
    }
  }

  const getHistoryTVL = async () => {
    const res = await getTVLHistory()
    if (!res.hasError) {
      setTvlData(res)
    }
  }
  useEffect(() => {
    getHistoryTVL()
    getWalletHoldersData()
    getTVL()
  }, [])

  const isColumn = width < 1500

  const onClickPrevPage = () => {
    setPagination(pagination - 1)
  }

  const onClickNextPage = () => {
    setPagination(pagination + 1)
  }

  // make sure to reverse
  const series = tvlData?.map((item:TVLHistoryData) => Number(item.TVL_total_usd)).reverse();
  const lastDataPoint = series[series.length - 1];
  const index = (series.length - 2) || 0;
  const perc = getPercentageValues(lastDataPoint, series[index]);

  return (
    <>
      <Title>Exchange</Title>
      <PageContainer>
        <Flex isColumn={isColumn}>
          {!tvlData.length ? (
            <CenterWrap>
              <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
            </CenterWrap>
          ) : (
            <>
              <BubbleChart type="line" data={tvlData} title="Liquidity" value={lastDataPoint} percentage={perc} />
              <BubbleMarginWrap>
                {loadingTV || loadingWC ? (
                  <CenterWrap>
                    <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
                  </CenterWrap>
                ) : (
                  <>
                    <Bubble variant="pink" color="#A7B1F4" title="Wallet Holders" showMountains={true}>
                      {new Intl.NumberFormat().format(walletHolderCount)}
                    </Bubble>
                    <Bubble
                      variant="purple"
                      color="#A7B1F4"
                      prefix="$"
                      suffix={fnum(totalValue)?.suffix}
                      title="Total Value Locked"
                      showMountains={true}
                    >
                      {fnum(totalValue)?.value?.toFixed(3)}
                    </Bubble>
                  </>
                )}
              </BubbleMarginWrap>
            </>
          )}
        </Flex>
        {transactionsData.loading || !transactionsData.data?.transactions ? (
          <CenterWrap>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </CenterWrap>
        ) : (
          <>
            <Transactions transactions={transactionsData.data?.transactions} />
            <FlexButtons>
              {pagination > 0 && (
                <Button>
                  <ButtonLight onClick={onClickPrevPage}>Back</ButtonLight>
                </Button>
              )}
              {transactionsData.data?.transactions.length >= 12 && (
                <Button>
                  <ButtonPrimary onClick={onClickNextPage}>Next</ButtonPrimary>
                </Button>
              )}
            </FlexButtons>
          </>
        )}
      </PageContainer>
    </>
  )
}
