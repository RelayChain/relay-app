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
            name: `TX`,
            data: series,


        }],

        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        tooltip: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: ['#FF008A', '#BD00FF'],
                dataLabels: {
                    enabled: true,
                    style: {
                        fontFamily: "Montserrat",
                        fontStyle: "normal",
                        fontWeight: "bold",
                        fontSize: "10px",
                        color: "white"
                    },
                    format: '<br>{point.percentage:.0f}%</br>',
                    distance: -20,
                    filter: {
                        property: 'percentage',
                        operator: '>',
                        value: 30
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
                    color: '#666666'
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
