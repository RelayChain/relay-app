import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js";
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
const Solidgauge = ({ lineChartWidth, series, typeChart }: BarChartProps) => {

    highchartsMore(Highcharts);
    solidGauge(Highcharts);
    const options: Highcharts.Options = {
        title: {
            text: ''
        },
        chart: {
            type: 'solidgauge',
            backgroundColor: 'transparent',
            height: 100,
            width: 100,
            spacingBottom: 0,
            spacingLeft: 0
        },



        pane: {
            startAngle: 0,
            endAngle: -360,


        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },

        // the value axis
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

        series: [{
            name: '',
            type: 'solidgauge',
            dataLabels: {
                enabled: true,

                format: `{point.y:.0f}%`,

            },
            data: [{
                color: '#e6cb00',
                radius: '100%',
                innerRadius: '75%',
                y: series[1]?.y
            }],
            tooltip: {
                valuePrefix: '<p>today fees </p>',
                valueSuffix: ' %',

            }
        }],
        credits: {
            enabled: false
        },


    }

    return (
        <Box id="container" >
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
    )
}

export default Solidgauge
