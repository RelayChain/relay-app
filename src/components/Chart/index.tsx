import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
// import getPercentageValues from '../../../utils/getPercentageValues'
import styled from 'styled-components'

type BarChartProps = {
    categoriesX: Array<string>
    onSelectedValue(value?: number, perc?: number): void
    lineChartWidth: number
    series: Array<number>
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
  display: flex;
  justify-content: center;
`

const BarChart = ({ categoriesX, onSelectedValue, lineChartWidth, series }: BarChartProps) => {
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
                        mouseOver: function () {
                            const index = Number(this.category) - 1 > 0 ? Number(this.category) - 1 : 0
                            const value = this.y || 0
                            const perc = series[index] / value //getPercentageValues(series[index], value)
                            onSelectedValue(value, perc)
                        },
                        mouseOut: () => {
                            onSelectedValue()
                        }
                    }
                }
            }
        ],
        tooltip: {
            enabled: true, borderRadius: 22, valueDecimals: 2, shared: true,
            className: 'toolTip', valuePrefix: '$'
        },
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
                    color: '#A7B1B4',
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
