import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import { CustomLightSpinner } from '../../theme'
import Circle from '../../assets/images/blue-loader.svg'
import Bubble from './../../components/Bubble'
import Logo from './../../assets/svg/logo_zero.svg'
import BubbleChart from './../../components/BubbleChart'
import transactions from '../../graphql/queries/transactions'
import zeroDayDatas from '../../graphql/queries/zeroDayDatas'

const HomeWrap = styled.div`
  width: 100%;
  padding-left: 350px;
  padding-right: 100px;
  font-family: Poppins;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding-left: 0px;
  padding-right: 0px;
`};
`
const TitleWrap = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
  margin-top: 50px;
  text-align: center;
`};
`
const Title = styled.h2`
  margin: 0;
  font-weight: 900;
  font-size: 80px;
  line-height: 80px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 49px;
`};
`
const WalletsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
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

const Flex = styled.div`
  margin: 60px auto 0;
  display: flex;
  justify-content: space-between;
`

export default function Home() {
  const [pagination, setPagination] = useState<number>(0)
  // const zeroData = useQuery(zeroDayDatas)
 
  const onClickPrevPage = () => {
    setPagination(pagination - 1)
  }

  const onClickNextPage = () => {
    setPagination(pagination + 1)
  }
  return (
    <HomeWrap>
      <TitleWrap>
        <img src={Logo} alt="Logo" />
        <Title>Exchange</Title>
      </TitleWrap>
      <WalletsWrap>
        <BubbleMarginWrap>
          <Bubble variant="green" color="#A7B1F4" icon="wallet">
            580 725
          </Bubble>
        </BubbleMarginWrap>
        <Bubble variant="blue" color="#A7B1F4" prefix="$" suffix="B" icon="alien">
          850.94
        </Bubble>
      </WalletsWrap>
      {/* <Flex>
        {zeroData.loading ? (
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        ) : (
          <>
            <BubbleChart type="line" data={zeroData.data} title="Liquidity" value={3156943} percentage={-34.66} />
            <BubbleChart type="bar" data={zeroData.data} title="Volume(24h)" value={4078912} percentage={3.66} />
          </>
        )}
      </Flex> */}
    </HomeWrap>
  )
}
