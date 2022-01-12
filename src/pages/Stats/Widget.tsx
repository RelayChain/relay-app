import PieChart from 'components/PieChart'
import Solidgauge from 'components/PieChart/solidgauge'
import WaveChart from 'components/PieChart/WaveChart'
import useStatInArray from 'hooks/useDailyTx'
import React from 'react'
import styled from 'styled-components'
const numeral = require('numeral')


type SeriesType = {
    name: string
    y: number
}
interface WidgetProps {
    type: string
    title: string
    value: any
    series: SeriesType[],
    widgetWidth: number
    different?: number
}

const WidgetContainer = styled.div<{ widgetWidth: number }>`
    display: flex;
    align-items: center
    background: linear-gradient(4.66deg, rgba(102, 102, 102, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    width:  ${({ widgetWidth }) => widgetWidth}px;
    height: 136px;
    padding: 25px;
`
const ChartBlock = styled(PieChart)`
    width: 104px;
    height: 104px;
`
const StyledWaveChart = styled(WaveChart)`
    width: 84px;
    height: 84px;
`
const StyledSolidgauge = styled(Solidgauge)`
    width: 84px;
    height: 84px;
`

const WidgetInfo = styled.div`
    display: flex;
    flex-direction: column;
    `
const WidgetTitle = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    color: #FFFFFF;
`
const WidgetValueBlock = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 27px;
    line-height: 33px;
    color: #FFFFFF;
`
const TxInfoBlock = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 13px;
    line-height: 16px;
    color: #38E4DE;
`
function Widget({ type, title, value, series, widgetWidth, different }: WidgetProps) {
    const now = new Date()
    const Yesterday = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() - 1} `
    const Today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + 1} `
    const txIntervalData = useStatInArray(`daily_txns?start_time='${Yesterday} 00:00:00'&end_time='${Today} 00:00:00'`)

    return (
        <WidgetContainer widgetWidth={widgetWidth}>
            {type === 'TVL' && <StyledWaveChart valueTop={47} valueBottom={53} />}
            {type === 'FEES' && <StyledSolidgauge lineChartWidth={50} series={series} typeChart={type} />}
            {type === 'TX' && <ChartBlock lineChartWidth={50} series={series} typeChart={type} />}

            <WidgetInfo>
                <WidgetTitle>{title}</WidgetTitle>
                <WidgetValueBlock>{type === 'TVL' ? '$ ' + numeral(value).format('0,0.00') : numeral(value).format('0,0')}</WidgetValueBlock>
                {type === 'TX' && <TxInfoBlock>{Math.abs(different || 0)}{`${(different || 0) > 0 ? ' txns more ' : ' txns less '} than yesterday`}</TxInfoBlock>}
            </WidgetInfo>
        </WidgetContainer>
    )
}

export default Widget
