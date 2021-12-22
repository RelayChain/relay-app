import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
// import getPercentageValues from '../../../utils/getPercentageValues'
import styled from 'styled-components'

type DataChart = {
    name: string
    y: number
    color?: any
}
type ColumnChartProps = {
    chartData: DataChart[],
    typeChart: string
}

const Box = styled.div`
  position: relative;
  padding-bottom: 54px;
  display: flex;
  justify-content: center;
`

const ColumnChart = ({ chartData, typeChart }: ColumnChartProps) => {

    const perShapeGradient = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1
    };
    const theme = {
        colors: [{
            linearGradient: perShapeGradient,
            stops: [
                [0, '#0AA5E8'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#FFC700'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#AD00FF'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#1969FF'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#E84142'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#F05A28'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#FFC700'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#CC006E'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#01943F'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#38E4DE'],
                [1, 'transparent']
            ]
        }, {
            linearGradient: perShapeGradient,
            stops: [
                [0, '#9C00B6'],
                [1, 'transparent']
            ]
        }
        ],

    };
    let dataWithColor: DataChart[] = []
    chartData.map((item, ind) => {
        item.color = theme.colors[ind]
        dataWithColor.push(item)
    })
    const options: Highcharts.Options = {
        title: {
            text: ''
        },
        chart: {
            type: 'column',
            styledMode: false,
            backgroundColor: 'transparent',
            height: 250,
            width: 500,
            spacingBottom: 0,
            spacingLeft: 5
        },

        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            gridLineWidth: 0.1,
            gridLineColor: '#0AA5E8',
            categories: Object.values(chartData.map(item => item.name)),
            tickColor: 'red',
            labels: {
                style: {
                    color: '#A7B1B4',
                    fontSize: '10px',
                    fontWeight: '600',
                    //@ts-ignore
                    fontFamily: 'Poppins'
                }
            }
        },
        yAxis: {
            visible: false

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 1,
                dataLabels: {
                    enabled: true,
                    format: `${typeChart === 'LIQUIDITY' ? '$ ' : ''}{point.y:.0f}`,
                    style: {
                        fontFamily: 'Montserrat',
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                        fontSize: '7px',
                        lineHeight: '9px',
                        textAlign: 'center',
                        color: '#FFFFFF',
                    }
                }
            },
            column: {
                // colors: dataWithColor.map(item => item.color),
                borderWidth: 5
            },
        },
        credits: {
            enabled: false
        },

        tooltip: {
            // headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            // pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b><br/>'
        },

        series: [
            {
                name: "",
                type: 'column',
                colorByPoint: false,
                data: chartData,
                color: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, '#003399'], // start
                        [1, '#3366AA'] // end
                    ]
                }

            }
        ],
    }



    return (
        <Box>
            <figure className="highcharts-figure">
                <HighchartsReact highcharts={Highcharts} options={options} />
            </figure>

        </Box>
    )
}

export default ColumnChart
