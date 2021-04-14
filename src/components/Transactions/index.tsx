import React from 'react'
import styled from 'styled-components'

import DropDown from './../DropDown'
import TransactionLine from './../TransactionLine'
import { TransactionTypes } from './../../graphql/types'
import useWindowDimensions from './../../hooks/useWindowDimensions'
import BubbleBase from './../BubbleBase'

const TransactionsWrap = styled.div`
  margin-top: 51px;
`
const SelectWrap = styled.div`
  display: flex;
  margin-top: 51px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  justify-content: space-between;
`};
`
const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  font-family: Poppins;
  margin-right: 30px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 20px;
`};
`
const Grid = styled.div`
  display: grid;
  margin-top: 50px;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin-top: 0px;
  grid-template-columns: 1fr 1fr;
  padding: 30px;
  overflow: hidden
`};
`
const GridWithMargin = styled(Grid)`
  margin-bottom: 20px;
  cursor: pointer;
`
const Heading = styled.h5`
  color: #a7b1f4;
  opacity: 0.4;
  font-size: 13px;
  font-weight: 600;
  font-family: Poppins;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  text-align: center
`};
`
const HeadingType = styled(Heading)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  text-align: left
`};
`
const HeadingValue = styled(Heading)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  text-align: center
`};
`
export type TransactionsProps = {
  transactions: TransactionTypes[]
}

const Transactions = ({ transactions }: TransactionsProps) => {
  const { width } = useWindowDimensions()

  return (
    <TransactionsWrap>
      <SelectWrap>
        <Title>Transactions</Title>
        <DropDown options={[{ label: 'Last 24h', value: '1' }]} />
      </SelectWrap>
      <Grid>
        <HeadingType>Type</HeadingType>
        <HeadingValue>Total Value</HeadingValue>
        {width > 500 && (
          <>
            <Heading>Amount #1</Heading>
            <Heading>Amount #2</Heading>
            <Heading style={{ textAlign: 'center' }}>Transaction</Heading>
            <Heading style={{ textAlign: 'right' }}>Date</Heading>
          </>
        )}
      </Grid>
      {transactions.map(
        (t, index) =>
          (t.mints.length > 0 || t.burns.length > 0 || t.swaps.length > 0) && (
            <GridWithMargin key={index} style={{ position: 'relative' }}>
              {width < 500 && <BubbleBase />}
              <TransactionLine {...t} />
            </GridWithMargin>
          )
      )}
    </TransactionsWrap>
  )
}

export default Transactions
