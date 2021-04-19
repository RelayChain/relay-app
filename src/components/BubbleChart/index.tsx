import React, { useRef, useState } from 'react'

import BarChart from './charts/BarChart'
import BubbleBase from './../BubbleBase'
import LineChart from './charts/LineChart'
import { LiquidityVolumeList } from './../../graphql/types'
import Percentage from './../Percantage'
import styled from 'styled-components'
import toCurrency from './../../utils/toCurrency'
import useResize from './../../hooks/widthComponent'

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
  width: 562px;
  height: 309px;
  padding-top: 46px;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  width: 100%;
  height: auto
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
  margin-bottom: 52px;
  width: 100%;
`
const FirstHeading = styled.div`
  font-weight: 500;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: #A7B1F4;
  opacity: 0.88;
`
const SecondHeading = styled.div`
  margin-top: 5px;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.01em;
  ::first-letter {
    font-size: 17px;
  }
`

const BubbleChart = ({ title, value, percentage, type, data }: BubbleChartProps) => {
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

  const componentRef = useRef()

  const { width, height } = useResize(componentRef)


  return (
    <BubbleChartWrap>
      <BubbleBase />
      {/* @ts-ignore */}
      <Flex ref={componentRef}>
        <FirstBox>
          <FirstHeading>{title}</FirstHeading>
          <SecondHeading>
            {toCurrency(selectedValue)}
            <Percentage value={currentPercentage} />
          </SecondHeading>
        </FirstBox>
        {type === 'line' ? (
            <LineChart onSelectedValue={onSelectedValue} data={data} lineChartWidth={width}/>
          ) : (
            <SecondBox>
              <BarChart onSelectedValue={onSelectedValue} data={data} lineChartWidth={width}/>
            </SecondBox>
          )}
      </Flex>
    </BubbleChartWrap>
  )
}

export default BubbleChart
