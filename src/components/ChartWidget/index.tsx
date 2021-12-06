import BarChart from 'components/Chart'
import React, { useState } from 'react' 
import styled from 'styled-components'

const Title = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    color: #FFFFFF;
`
const ChartBlock = styled.div`

`
type ChartWidgetProps = {
    title: string;
    data?: []
}
export function ChartWidget({title, data}: ChartWidgetProps) {
    const onSelectedValue = (selectedValue?: number, selectedPerc?: number) => {

    }
    const series =  [
            122,
            134,
            146,
            138,
            158,
            144,
            163
        ]
         const categoriesX =[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ] 
    return(
    <>
    <Title>{title}</Title>
    <BarChart  onSelectedValue={onSelectedValue}
                                categoriesX={categoriesX}
                                series={series}
                                lineChartWidth={500} ></BarChart>
    </>
    )
}