import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import styled from 'styled-components'

type BarChartProps = {
    lineChartWidth: number
    series: { name: string, y: number }[]
    typeChart: string
}

const Box = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`
//  // 
const PieChart = ({ lineChartWidth, series, typeChart }: BarChartProps) => {

    const options: Highcharts.Options = {
        title: {
            text: ''
        },
        series: [{
            type: 'pie',
            name: 'Share',
            data: series
        }],
        tooltip: {
            enabled: false
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: ['#FF008A', '#BD00FF'],
                dataLabels: {
                    enabled: true,
                    format: '<br>{point.percentage:.0f}%</br>',
                    distance: -15,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 8
                    }
                }
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            labels: {
                style: {
                    color: 'transparent',
                    fontSize: "0px"
                }
            },
            plotBands: [
                {
                    from: 0,
                    to: 100,
                    color: '#666666' // green
                }
            ]
        },
        chart: {
            backgroundColor: 'transparent',
            height: 100,
            width: 100,
            spacingBottom: 0,
            spacingLeft: 0
        },
        credits: {
            enabled: false
        },

    }

    return (
        <Box id="container">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
    )
}

export default PieChart
