import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import Bubble from './../../components/Bubble'
import BubbleChart from './../../components/BubbleChart'
import transactions from '../../graphql/queries/transactions'
import zeroDayDatas from '../../graphql/queries/zeroDayDatas'
import useWindowDimensions from './../../hooks/useWindowDimensions'

const HomeWrap = styled.div`
  padding: 0px 64px;
  width: 100%;
`
const Title = styled.h1`
  margin-bottom: 70px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  text-align: center;
  font-size: 49px;
  margin-top: 70px;
`};
`
const WalletsWrap = styled.div<{ isColumn: boolean }>`
  display: flex;
  justify-content: ${({ isColumn }) => (isColumn  ? 'center' : 'flex-end')};
  margin-top: 15px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 45px;
  justify-content: center;
`};
`
const BubbleMarginWrap = styled.div`
  margin-right: 24px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  padding: 2px;
  margin-right: 5px;
`};
`
const Flex = styled.div<{ isColumn: boolean }>`
  margin: 60px auto 0;
  display: flex;
  justify-content: ${({ isColumn }) => (isColumn  ? 'center' : 'space-between')};
  flex-wrap: wrap;
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  flex-direction: column;
  align-items: center;
`};
`
const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export default function Home() {
  const [pagination, setPagination] = useState<number>(0)
  const zeroData = useQuery(zeroDayDatas)
  const { width } = useWindowDimensions()

  const isColumn = width < 1500;

  const onClickPrevPage = () => {
    setPagination(pagination - 1)
  }

  const onClickNextPage = () => {
    setPagination(pagination + 1)
  }
  return (
    <HomeWrap>
      <Title>Exchange</Title>
      <WalletsWrap isColumn={isColumn}>
        <BubbleMarginWrap>
          <Bubble variant="green" color="#A7B1F4" icon="wallet">
            580 725
          </Bubble>
        </BubbleMarginWrap>
        <Bubble variant="blue" color="#A7B1F4" prefix="$" suffix="B" icon="alien">
          850.94
        </Bubble>
      </WalletsWrap>
      <Flex isColumn={isColumn}>
        {true ? (
          <CenterWrap>
            <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
          </CenterWrap>
        ) : (
          <>
            <BubbleChart type="line" data={zeroData.data} title="Liquidity" value={3156943} percentage={-34.66} />
            <BubbleChart type="bar" data={zeroData.data} title="Volume(24h)" value={4078912} percentage={3.66} />
          </>
        )}
      </Flex>
    </HomeWrap>
  )
}
