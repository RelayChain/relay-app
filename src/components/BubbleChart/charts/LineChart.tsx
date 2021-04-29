import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { TVLHistoryData } from '../../../graphql/types'
import { dateFormatted } from '../../../utils/getFormattedMonth'
import getPercentageValues from './../../../utils/getPercentageValues'
import styled from 'styled-components'

type LineChartProps = {
  data: TVLHistoryData[] | any
  onSelectedValue(value?: number, perc?: number): void
  lineChartWidth: number
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
`

const LineChart = ({ data, onSelectedValue, lineChartWidth }: LineChartProps) => {

  const series = data?.map((item:TVLHistoryData) => Number(item.TVL_total_usd))

  const options: Highcharts.Options = {
    title: {
      text: '',
    },
    series: [
      {
        type: 'areaspline',
        data: series,
        point: {
          events: {
            mouseOver: function () {
              const index = Number(this.index) - 1 > 0 ? Number(this.index) - 1 : 0
              const value = this.y || 0

              const perc = getPercentageValues(value, series[index])
              onSelectedValue(value, perc)
            },
            mouseOut: () => {
              onSelectedValue()
            },
          },
        },
      },
    ],
    tooltip: { enabled: false },
    plotOptions: {
      series: {
        showInLegend: false,
      },
      areaspline: {
        lineWidth: 4,
        color: '#7244D3',
        fillColor: {
          //@ts-ignore
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, '#6752F7'],
            [0.5, 'rgba(34,39,89, 0)'],
            [1, 'rgba(34,39,89, 0)'],
          ],
        },
        marker: {
          enabled: false,
        },
      },
    },
    chart: {
      backgroundColor: 'transparent',
      height: 181,
      width: lineChartWidth,
      spacingBottom: 0,
      spacingLeft: 5,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: dateFormatted(data),
      lineColor: 'transparent',
      minorGridLineColor: 'transparent',
      tickColor: 'transparent',
      labels: {
        style: {
          color: '#A7B1F4',
          fontSize: '12px',
          fontWeight: '600',
          //@ts-ignore
          fontFamily: 'Poppins'
        },
      },
    },
    yAxis: {
      visible: false,
    },
  }

  return (
    <Box >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  )
}

export default LineChart
