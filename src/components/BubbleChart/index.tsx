import React, { useState } from 'react'
import styled from 'styled-components'

import BubbleBase from './../BubbleBase'
import Percentage from './../Percantage'
import { LiquidityVolumeList } from './../../graphql/types'
import toCurrency from './../../utils/toCurrency'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import useWindowDimensions from './../../hooks/useWindowDimensions'

type DateBoxType = {
  date: Date
  value: number
}

export type BubbleChartProps = {
  title: string
  value: number
  percentage: number
  date?: DateBoxType
  flipMonthWeek?: boolean
  type: 'line' | 'bar'
  data: LiquidityVolumeList
}

const BubbleChartWrap = styled.div`
  width: 546px;
  height: 309px;
  padding-top: 46px;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  max-width: 546px;
  width: 100%
`};
`
const Flex = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`
const FirstBox = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 42px;
`
const SecondBox = styled.div`
  margin-botoom: 52px;
`
const FirstHeading = styled.div`
  font-weight: 500;
  font-size: 12px;
  letter-spacing: -0.01em;
  color: #A7B1F4;
  opacity: 0.88;
`
const SecondHeading = styled.div`
  margin-top: 5px;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: -0.01em;
`

const BubbleChart = ({ title, value, percentage, type, data }: BubbleChartProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(value)
  const [currentPercentage, setCurrentPercentage] = useState<number>(percentage)
  const { width } = useWindowDimensions()

  let lineChartWidth = 472;
  
  if (width < 500) {
    lineChartWidth = 380
  }
  if (width < 400) {
    lineChartWidth = 320
  }

  const onSelectedValue = (selectedValue?: number, selectedPerc?: number) => {
    if (!selectedValue || !selectedPerc) {
      setSelectedValue(value)
      setCurrentPercentage(percentage)
      return
    }
    setSelectedValue(selectedValue)
    setCurrentPercentage(selectedPerc)
  }

  return (
    <BubbleChartWrap>
      <BubbleBase />
      <Flex>
        <FirstBox>
          <FirstHeading>{title}</FirstHeading>
          <SecondHeading>
            {toCurrency(selectedValue)}
            <Percentage value={currentPercentage} />
          </SecondHeading>
        </FirstBox>
        {type === 'line' ? (
            <LineChart onSelectedValue={onSelectedValue} data={data} lineChartWidth={lineChartWidth}/>
          ) : (
            <SecondBox>
              <BarChart onSelectedValue={onSelectedValue} data={data} lineChartWidth={lineChartWidth}/>
            </SecondBox>
          )}
      </Flex>
    </BubbleChartWrap>
  )
}

export default BubbleChart
