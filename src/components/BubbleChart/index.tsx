import React, { useState } from 'react'
import styled from 'styled-components'

import BubbleBase from './../BubbleBase'
import Percentage from './../Percantage'
import { LiquidityVolumeList } from './../../graphql/types'
import toCurrency from './../../utils/toCurrency'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'

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
`
const Flex = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`
const FirstBox = styled.div`
  position: relative;
  z-ndex: 1;
  padding: 0 42px;
`
const SecondBox = styled.div`
  margin-botoom: 52px;
`
const FirstHeading = styled.div`
  font-weight: bold;
  font-size: 20px;
`
const SecondHeading = styled.div`
  font-weight: bold;
  font-size: 15px;
  margin-top: 22px;
`

const BubbleChart = ({ title, value, percentage, type, data, date, flipMonthWeek }: BubbleChartProps) => {
  const [selectedValue, setSelectedValue] = useState<number>(value)
  const [currentPercentage, setCurrentPercentage] = useState<number>(percentage)

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
            <LineChart onSelectedValue={onSelectedValue} data={data} />
          ) : (
            <SecondBox>
              <BarChart onSelectedValue={onSelectedValue} data={data} />
            </SecondBox>
          )}
      </Flex>
    </BubbleChartWrap>
  )
}

export default BubbleChart
