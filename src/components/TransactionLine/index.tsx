import React, { useState } from 'react'
import styled from 'styled-components'

import DoubleCurrencyLogo from '../DoubleLogo'
import { TransactionTypes } from './../../graphql/types'
import toEllipsis from './../../utils/toEllipsis'
import useWindowDimensions from './../../hooks/useWindowDimensions'

const Logo = styled(DoubleCurrencyLogo)`
  margin-bottom: 20px;
`
const Flex = styled.span`
  display: flex;
`

const Text = styled.div`
  font-family: Poppins;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: -0.01em;
  color: #b7c0f9;
  opacity: 0.8;
  text-align: center
  margin-top:5px
    ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 14px;
  border-radius: 28px;
`};
`
const TextTransition = styled(Text)`
  color: #b368fc;
`
const TextValue = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
text-align: right
margin-right:25px;
`};
`
const TextColumnLeft = styled(Text)`
  font-size: 12px;
  opacity: 0.4;
  margin-top: 30px;
  text-align: left;
`
const TextColumnRight = styled(TextColumnLeft)`
  opacity: 1;
  text-align: right;
  margin-right: 25px;
  position: relative;
`
const DropDownBoxArrow = styled.div`
  position: absolute;
  cursor: pointer;
  top: 50%;
  right:0
  margin-right: 5px;
  transform: translateY(-50%);
`
const DropDownBoxArrowUp = styled(DropDownBoxArrow)`
  top: 25px;
  transform: translateY(0);
`
const InnerWrap = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

export type TransactionLineProps = TransactionTypes & {}

const TransactionLine = ({ mints, burns, swaps }: TransactionLineProps) => {
  const { width } = useWindowDimensions()
  const [isOpen, setisOpen] = useState<boolean>(false)

  if (mints.length < 1 && burns.length < 1 && swaps.length < 1) return null

  const getData = () => {
    switch (true) {
      case mints.length > 0:
        return {
          token0: mints[0].pair.token0,
          token1: mints[0].pair.token1,
          type: `Add ${mints[0].pair.token0.symbol} / ${mints[0].pair.token1.symbol}`,
          totalValue: mints[0].amountUSD,
          amount0: mints[0].amount0,
          amount1: mints[0].amount1,
          transaction: mints[0].transaction.id,
          date: new Date(Number(mints[0].transaction.timestamp) * 1000)
        }

      case burns.length > 0:
        return {
          token0: burns[0].pair.token0,
          token1: burns[0].pair.token1,
          type: `Remove ${burns[0].pair.token0.symbol} / ${burns[0].pair.token1.symbol}`,
          totalValue: burns[0].amountUSD,
          amount0: burns[0].amount0,
          amount1: burns[0].amount1,
          transaction: burns[0].transaction.id,
          date: new Date(Number(burns[0].transaction.timestamp) * 1000)
        }

      case swaps.length > 0:
        return {
          token0: swaps[0].pair.token0,
          token1: swaps[0].pair.token1,
          type: `Swap ${swaps[0].pair.token0.symbol} / ${swaps[0].pair.token1.symbol}`,
          totalValue: swaps[0].amountUSD,
          amount0: swaps[0].amount0Out,
          amount1: swaps[0].amount1Out,
          transaction: swaps[0].transaction.id,
          date: new Date(Number(swaps[0].transaction.timestamp) * 1000)
        }

      default:
        return {}
    }
  }

  const data = getData()

  if (!data.transaction) return null

  const { type, totalValue, amount0, amount1, transaction, date, token0, token1 } = data

  return (
    <>
      <div>
        <Flex>
          <Logo currency0={token0} currency1={token1} size={24} style={{ marginRight: '8px' }} />
          <Text style={{ marginLeft: '10px' }}>{type}</Text>
        </Flex>
        {width < 720 && isOpen && (
          <>
            <TextColumnLeft>Amount #1</TextColumnLeft>
            <TextColumnLeft>Amount #2</TextColumnLeft>
            <TextColumnLeft>Transaction</TextColumnLeft>
            <TextColumnLeft>Date</TextColumnLeft>
          </>
        )}
      </div>
      <div>
        <TextValue>${Number(totalValue).toFixed(2)}</TextValue>

        {width < 720 && isOpen && (
          <>
            <TextColumnRight>${Number(totalValue).toFixed(2)}</TextColumnRight>
            <TextColumnRight>{Number(amount1).toFixed(6)}</TextColumnRight>
            <TextColumnRight style={{ color: '#1CB0F9', position: 'relative' }}>
              {width > 1424
                ? toEllipsis(transaction, 20)
                : width > 1000
                ? toEllipsis(transaction, 28)
                : toEllipsis(transaction, 30)}
            </TextColumnRight>
            <TextColumnRight>
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
              }).format(date)}
            </TextColumnRight>
          </>
        )}
      </div>

      {width < 720 && !isOpen && (
        <DropDownBoxArrow>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.17651 2.39708L8.17651 8.39708L14.1765 2.39708"
              stroke="#727BBA"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DropDownBoxArrow>
      )}

      {width < 720 && isOpen && (
        <DropDownBoxArrowUp>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.17676 8.39706L8.17676 2.39706L14.1768 8.39706"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </DropDownBoxArrowUp>
      )}

      {width > 720 && (
        <>
          <Text>
            {width > 1424
              ? Number(totalValue).toFixed(8)
              : width > 1000
              ? Number(totalValue).toFixed(4)
              : Number(totalValue).toFixed(2)}
          </Text>
          <Text>{Number(amount1).toFixed(6)}</Text>
          <TextTransition>
            {width > 1424
              ? toEllipsis(transaction, 24)
              : width > 1000
              ? toEllipsis(transaction, 28)
              : toEllipsis(transaction, 30)}
          </TextTransition>
          <Text style={{ textAlign: 'right' }}>
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false
            }).format(date)}
          </Text>
        </>
      )}

      {width < 720 && <InnerWrap onClick={() => setisOpen(!isOpen)} />}
    </>
  )
}

export default TransactionLine
