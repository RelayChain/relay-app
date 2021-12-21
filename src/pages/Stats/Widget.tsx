import PieChart from 'components/PieChart'
import Solidgauge from 'components/PieChart/solidgauge'
import WaveChart from 'components/PieChart/WaveChart'
import useStatInArray from 'hooks/useDailyTx'
import React, { useEffect, useState } from 'react'
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
function Widget({ type, title, value }: WidgetProps) {
    const now = new Date()
    const Yesterday = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() - 1} `
    const Today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + 1} `
    const txIntervalData = useStatInArray(`daily_txns?start_time='${Yesterday} 00:00:00'&end_time='${Today} 00:00:00'`)
    type SeriesType = {
        name: string
        y: number
    }
    const [differentValue, setDifferent] = useState(0)
    const initSeries: SeriesType[] = []
    const [series, setSeries] = useState(initSeries)
    useEffect(() => {
        if (txIntervalData.length === 2) {
            let sumTx = txIntervalData[0]['Transactions'] + txIntervalData[1]['Transactions']
            const data = series
            let txValue = 0
            txIntervalData.map(item => {
                txValue = txValue < +item['Transactions'] ? (item['Transactions'] - txValue) : txValue - item['Transactions']

                const newData = {} as SeriesType

                newData.y = Math.round((item['Transactions'] / sumTx) * 100)
                data.push(newData)


            })
            setDifferent(txValue)
            setSeries(data)
        }
    }, [txIntervalData])

    return (
        <WidgetContainer>
            {type === 'TVL' && <StyledWaveChart valueTop={47} valueBottom={53} />}
            {type === 'FEES' && <StyledSolidgauge lineChartWidth={50} series={series} typeChart={type} />}
            {type === 'TX' && <ChartBlock lineChartWidth={50} series={series} typeChart={type} />}

            <WidgetInfo>
                <WidgetTitle>{title}</WidgetTitle>
                <WidgetValueBlock>{type === 'TVL' ? '$ ' : ''}{numeral(value).format('0,0.00')}</WidgetValueBlock>
                {type === 'TX' && <TxInfoBlock>{Math.abs(differentValue)}{`${differentValue > 0 ? ' txns more ' : ' txns less '} than yesterday`}</TxInfoBlock>}
            </WidgetInfo>
        </WidgetContainer>
    )
}

export default Widget
