import React from 'react'
import styled from 'styled-components'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { LiquidityVolumeList } from '../../../graphql/types'
import getPercentageValues from '../../../utils/getPercentageValues'

type BarChartProps = {
  data: LiquidityVolumeList
  onSelectedValue(value?: number, perc?: number): void
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
`

const BarChart = ({ data, onSelectedValue }: BarChartProps) => {
  const series = data.zeroDayDatas.map(a => Number(a.dailyVolumeUSD))

  const options: Highcharts.Options = {
    title: {
      text: ''
    },
    series: [
      {
        type: 'column',
        data: series,
        point: {
          events: {
            mouseOver: function() {
              const index = Number(this.category) - 1 > 0 ? Number(this.category) - 1 : 0
              const value = this.y || 0
              const perc = getPercentageValues(series[index], value)
              onSelectedValue(value, perc)
            },
            mouseOut: () => {
              onSelectedValue()
            }
          }
        }
      }
    ],
    tooltip: { enabled: false },
    plotOptions: {
      series: {
        showInLegend: false
      },
      column: {
        color: '#7244D3',
        borderWidth: 0
      }
    },
    chart: {
      backgroundColor: 'transparent',
      height: 181,
      width: 472,
      spacingBottom: 0,
      spacingLeft: 5
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: data.zeroDayDatas.map(a => new Date(a.date * 1000).getDate().toString()),
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
        }
      }
    },
    yAxis: {
      visible: false
    }
  }

  return (
    <Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  )
}

export default BarChart
