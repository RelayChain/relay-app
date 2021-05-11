import React from 'react'
import TransactionLine from './../TransactionLine'
import { TransactionTypes } from './../../graphql/types'
import styled from 'styled-components'
import useWindowDimensions from './../../hooks/useWindowDimensions'

const TransactionsWrap = styled.div`
  margin-top: 51px;
`
const SelectWrap = styled.div`
  display: flex;
  margin-top: 51px;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: space-between;
`};
`
const Title = styled.h2`
  font-size: 32px;
  font-weight: bold;
  font-family: Poppins;
  margin-right: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 20px;
`};
`
const Grid = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
  padding: 16px 45px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  margin-top: 0px;
  grid-template-columns: 1fr 1fr;
  padding: 25px;
  overflow: hidden
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
grid-template-columns: 1.5fr 1fr;
padding: 15px;
`};
`
const GridWithMargin = styled(Grid)`
  cursor: pointer;
  border-bottom: 0px solid rgba(167, 177, 244, 0.1);
  border-bottom-width: 1px;
  &:last-of-type {
    border-bottom-width: 0px;
  }
`
const Heading = styled.h5`
  color: #a7b1f4;
  opacity: 0.4;
  font-size: 13px;
  font-weight: 600;
  font-family: Poppins;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center
`};
`

const HeadingValue = styled(Heading)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: right
`};
`

const Wrapper = styled.div`
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding: 30px 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  border-radius: 16px;
  padding: 16px 16px;
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
        <Title>Latest Transactions</Title>
        {/*<DropDown options={[{ label: 'Last 24h', value: '1' }]} />*/}
      </SelectWrap>
      <Wrapper>
        <Grid>
          <Heading style={{ textAlign: 'left' }}>Type</Heading>
          <HeadingValue>Total Value</HeadingValue>
          {width > 720 && (
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
                <TransactionLine {...t} />
              </GridWithMargin>
            )
        )}
      </Wrapper>
    </TransactionsWrap>
  )
}

export default Transactions
