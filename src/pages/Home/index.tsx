import React, { useState } from 'react'

import Bubble from './../../components/Bubble'
import BubbleChart from './../../components/BubbleChart'
import Circle from '../../assets/images/blue-loader.svg'
import { CustomLightSpinner } from '../../theme'
import PageContainer from './../../components/PageContainer'
import Transactions from './../../components/Transactions'
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
`};
${({ theme }) => theme.mediaWidth.upToExtraSmall`
 width: 100%;
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
  margin-top: 1rem;
  margin-bottom: 1rem;
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
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #1EF7E7;
  color: #1EF7E7;
  outline: none;
  cursor: pointer;
  margin-left: 20px;
  transition: all ease 0.3s;
  :hover {
    filter: brightness(.9);
    color: #1EF7E7;
  }
`

export default function Home() {
  const [pagination, setPagination] = useState<number>(0)
  const { width } = useWindowDimensions()
  const zeroData = useQuery(zeroDayDatas)
  const transactionsData = useQuery(transactions, {
    variables: {
      first: 12,
      skip: pagination * 12
    }
  })

  const isColumn = width < 1500

  const onClickPrevPage = () => {
    setPagination(pagination - 1)
  }

  const onClickNextPage = () => {
    setPagination(pagination + 1)
  }
  return (
    <>
    <Title>Exchange</Title>
    <PageContainer>
      <WalletsWrap isColumn={isColumn}>
        <BubbleMarginWrap>
          <Bubble variant="green" color="#A7B1F4" title="Wallet Holders">
            580,725
          </Bubble>
          <Bubble variant="blue" color="#A7B1F4" prefix="$" suffix="B" title="Total Value Locked">
            850.94
          </Bubble>
        </BubbleMarginWrap>
      </WalletsWrap>
      <Flex isColumn={isColumn}>
        {zeroData.loading ? (
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
      {transactionsData.loading ? (
        <CenterWrap>
          <CustomLightSpinner src={Circle} alt="loader" size={'90px'} />
        </CenterWrap>
      ) : (
        <>
          <Transactions transactions={transactionsData.data.transactions} />
          <FlexButtons>
            {pagination > 0 && <Button onClick={onClickPrevPage}>Back</Button>}
            {transactionsData.data.transactions.length >= 12 && <Button onClick={onClickNextPage}>Next</Button>}
          </FlexButtons>
        </>
      )}
    </PageContainer>
    </>
  )
}
