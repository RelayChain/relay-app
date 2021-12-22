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
    barColor: string
    typeChart: string
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
  display: flex;
  justify-content: center;
`

const BarChart = ({ categoriesX, onSelectedValue, lineChartWidth, series, barColor, typeChart }: BarChartProps) => {

    const kindOfChart = {
        "LIQUIDITY": "column",
        "TX": "column",
        "VOLUME": "area",
        'TXCHAIN': 'column'
    }
    const options: Highcharts.Options = {
        title: {
            text: ''
        },
        series: [
            {
                name: "",
                type: kindOfChart[typeChart],
                data: series,
                borderWidth: 0,
                dataLabels: {
                    enabled: false,

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
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#FF008A'],
                        [1, '#AD00FF'],
                    ]
                },
                borderWidth: 0
            },
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0.45,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, '#0AA5E8'],
                        [1, 'transparent'],
                    ]
                }
            }
        },
        chart: {
            styledMode: false,
            backgroundColor: 'transparent',
            height: 250,
            width: lineChartWidth,
            spacingBottom: 0,
            spacingLeft: 5,
            plotShadow: typeChart === "VOLUME"
        },
        credits: {
            enabled: false
        },
        xAxis: {
            gridLineWidth: 0.1,
            gridLineColor: '#0AA5E8',
            categories: categoriesX,
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
            visible: false,

        }
    }

    return (
        <Box>
            <figure className="highcharts-figure">
                <HighchartsReact highcharts={Highcharts} options={options} />
            </figure>

        </Box >
    )
}

export default BarChart
