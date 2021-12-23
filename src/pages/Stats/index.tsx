import { ChartWidget } from 'components/ChartWidget'
import useTvl from 'hooks/useTvl'
import useTotalTx from 'hooks/useTotalTx'
import React, { Component, useEffect, useState } from 'react'
import styled from 'styled-components'
import TopLiquidity from './TopLiquidity'
import Widget from './Widget'
import useTotalData from 'hooks/useTotalTx'
import useStatInArray from 'hooks/useDailyTx'
import { isMobile } from 'react-device-detect'


const StatsTitle = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 55px;
    color: #7F46F0;
    margin-left: 230px;
`

const WidgetContainer = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap
    justify-content: space-around;

`
const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    // display: grid;
    // grid-template-areas: 
    // "chartLiq chartVol"
    // "chartTxChain chartTx";
    // grid-template-rows: 1fr 1fr;
    // grid-template-columns: 1fr 1fr;
    // grid-gap: 10px; 
    // margin-top: 10px;
    // justify-items: center;
    // align-items: center;
`

const StyledWidgetBlock = styled.div` 
`

const TxWidget = styled.div`
width: 100px; 
`
const FeeWidget = styled.div`
width: 100px; 
`
const ChartLiquidity = styled.div`
grid-area: chartLiq;
`
const ChartVolume = styled.div`
grid-area: chartVol;
`
const ChartTxByChain = styled.div`
grid-area: chartTxChain;
`
const ChartTx = styled.div`
grid-area: chartTx;
`
const StatsContainer = styled.div` 
    
`
const WrapStats = styled.div`
    max-width: 1400px;
    padding: 30px;
`
export default function Stats({ }) {
    const [totalTvl, setTotalTvl] = useState(1)
    const [totalTx, setTotalTx] = useState(0)
    const [totalFees, setTotalFees] = useState(0)
    const [totalVolume, setTotalVolume] = useState(0)
    const tvl = useTvl()
    const totTx = useTotalData('total_txn')
    const totFees = useTotalData('total_fees')
    const totVolume = useTotalData('total_bridged_value')
    const now = new Date()
    const formattedDay = (daysFromToday: number) => `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate() + daysFromToday} `
    const Yesterday = formattedDay(-1)
    const Today = formattedDay(0)
    const Tomorrow = formattedDay(1)
    const txIntervalData = useStatInArray(`daily_txns?start_time='${Yesterday} 00:00:00'&end_time='${Tomorrow} 00:00:00'`)

    type SeriesType = {
        name: string
        y: number
    }
    const [differentValue, setDifferent] = useState(0)
    const [txTodayValue, setTxTodayValue] = useState(0)
    const initSeries: SeriesType[] = []
    const [series, setSeries] = useState(initSeries)
    const [chartWidth, setChartWidth] = useState(window.innerWidth / 2)
    const [widgetWidth, setWidgetWidth] = useState(384)
    useEffect(() => {
        console.log('chartWidth :>> ', chartWidth);
        if (isMobile) {
            console.log("🚀 ~ file: index.tsx ~ line 113 ~ useEffect ~ isMobile", isMobile)
            setChartWidth(window.innerWidth * 0.9)
            setWidgetWidth(window.innerWidth * 0.9)
            console.log('chartWidth :>> ', chartWidth);
        }
    }, [isMobile])
    useEffect(() => {
        if (txIntervalData.length === 2) {
            setTxTodayValue(txIntervalData[1]['Transactions'])
            console.log("🚀 ~ file: Widget.tsx ~ line 81 ~ useEffect ~ txIntervalData", txIntervalData)
            let sumTx = txIntervalData[0]['Transactions'] + txIntervalData[1]['Transactions']
            const data = series
            let txValue = txIntervalData[1]['Transactions'] - txIntervalData[0]['Transactions']
            txIntervalData.map(item => {
                const newData = {} as SeriesType
                newData.y = Math.round((item['Transactions'] / sumTx) * 100)
                data.push(newData)
            })
            // setDifferent(txValue)
            setSeries(data)
        }
    }, [txIntervalData])

    useEffect(() => {
        setTotalTx(Math.round(totTx))
    }, [totTx])

    useEffect(() => {
        setTotalVolume(Math.round(totVolume))
    }, [totVolume])

    useEffect(() => {
        setTotalFees(Math.round(totFees))
    }, [totFees])

    useEffect(() => {
        setTotalTvl(Math.round(tvl))
    }, [tvl])
    return (
        <WrapStats>
            <WidgetContainer>
                <StyledWidgetBlock>
                    <Widget type={'TVL'} title={'TVL'} value={totalTvl} series={series} widgetWidth={widgetWidth}></Widget>
                </StyledWidgetBlock>
                <StyledWidgetBlock>
                    <Widget type={'TX'} title={'Total Txns'} value={totalTx} series={series} widgetWidth={widgetWidth}></Widget>
                </StyledWidgetBlock>
                <StyledWidgetBlock>
                    <Widget type={'FEES'} title={'Total Fees'} value={totalFees} series={series} widgetWidth={widgetWidth}></Widget>
                </StyledWidgetBlock>
            </WidgetContainer>

            <ChartContainer>
                {false && <ChartLiquidity><ChartWidget type={'LIQUIDITY'} title={'Liquidity'} width={chartWidth}></ChartWidget></ChartLiquidity>}
                <ChartWidget type={'VOLUME'} title={'Bridge Volume'} value={totalVolume} width={chartWidth}></ChartWidget>
                <ChartWidget type={'TXCHAIN'} title={'Tnx By Chain'} width={chartWidth}></ChartWidget>
                <ChartWidget type={'TX'} title={'Transactions'} value={txTodayValue} width={chartWidth}></ChartWidget>
            </ChartContainer>
            {false && <TopLiquidity title={'Top Liquidity'} />}
        </WrapStats>
    )
}
