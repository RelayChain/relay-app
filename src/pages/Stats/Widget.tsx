import PieChart from 'components/PieChart'
import Solidgauge from 'components/PieChart/solidgauge'
import React from 'react'
import styled from 'styled-components'
const numeral = require('numeral')

interface WidgetProps {
    type: string
    title: string
    value: any
}

const WidgetContainer = styled.div`
    display: flex;
    align-items: center
    background: linear-gradient(4.66deg, rgba(102, 102, 102, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    width: 384px;
    height: 136px;
    padding: 25px;
`
const ChartBlock = styled(PieChart)`
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
function Widget({ type, title, value }: WidgetProps) {
    const onSelectedValue = (selectedValue?: number, selectedPerc?: number) => {

    }
    const series = [
        { name: '', y: 25 },
        { name: '', y: 75 }
    ]

    return (
        <WidgetContainer>
            {type === 'FEES' && <StyledSolidgauge lineChartWidth={50} series={series} typeChart={type} />}
            {type !== 'FEES' && <ChartBlock lineChartWidth={50} series={series} typeChart={type} />}

            <WidgetInfo>
                <WidgetTitle>{title}</WidgetTitle>
                <WidgetValueBlock>{type === 'TVL' ? '$ ' : ''}{numeral(value).format('0,0.00')}</WidgetValueBlock>
                {type === 'TX' && <TxInfoBlock>{'4365 txns more than yesterday'}</TxInfoBlock>}
            </WidgetInfo>
        </WidgetContainer>
    )
}

export default Widget
