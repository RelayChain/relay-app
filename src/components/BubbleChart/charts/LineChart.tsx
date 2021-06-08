import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import getPercentageValues from './../../../utils/getPercentageValues'
import styled from 'styled-components'

type LineChartProps = {
  categoriesX: Array<string>
  onSelectedValue(value?: number, perc?: number): void
  lineChartWidth: number
  series: Array<number>
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
`

const LineChart = ({ categoriesX, onSelectedValue, lineChartWidth, series }: LineChartProps) => {
  const options: Highcharts.Options = {
    title: {
      text: ''
    },
    series: [
      {
        type: 'areaspline',
        data: series,
        point: {
          events: {
            mouseOver: function() {
              const index = Number(this.index) - 1 > 0 ? Number(this.index) - 1 : 0
              const value = this.y || 0
              const perc = getPercentageValues(value, series[index])
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
      areaspline: {
        lineWidth: 4,
        color: '#B86FFF',
        fillColor: {
          //@ts-ignore
          linearGradient: [0, 0, 0, 300],
          stops: [
            [0, '#6752F7'],
            [0.5, 'rgba(34,39,89, 0)'],
            [1, 'rgba(34,39,89, 0)']
          ]
        },
        marker: {
          enabled: false
        }
      }
    },
    chart: {
      backgroundColor: 'transparent',
      height: 181,
      width: lineChartWidth,
      spacingBottom: 0,
      spacingLeft: 5
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: categoriesX,
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

export default LineChart
