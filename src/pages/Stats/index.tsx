import { ChartWidget } from 'components/ChartWidget'
import useTvl from 'hooks/useTvl'
import useTotalTx from 'hooks/useTotalTx'
import React, { Component, useEffect, useState } from 'react'
import styled from 'styled-components'
import TopLiquidity from './TopLiquidity'
import Widget from './Widget'
import useTotalData from 'hooks/useTotalTx'


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
    justify-content: space-between;
    margin-top: 105px;
    max-width: 1020px;
    padding-right: 125px;

`
const ChartContainer = styled.div`
    display: grid;
    grid-template-areas: 
    "chartLiq chartVol"
    "chartTxChain chartTx";
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px; 
    margin-top: 10px;
    justify-items: center;
    align-items: center;
`



const TvlWidget = styled.div`
width: 100px; 
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
    max-width: 1240px;
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
        <StatsContainer>
            <StatsTitle>Dashboard</StatsTitle>
            <WrapStats>
                <WidgetContainer>
                    <TvlWidget>
                        <Widget type={'TVL'} title={'TVL'} value={totalTvl}></Widget>
                    </TvlWidget>
                    <TxWidget>
                        <Widget type={'TX'} title={'Total Txns'} value={totalTx}></Widget>
                    </TxWidget>
                    <FeeWidget>
                        <Widget type={'FEES'} title={'Total Fees'} value={totalFees}></Widget>
                    </FeeWidget>
                </WidgetContainer>

                <ChartContainer>
                    <ChartLiquidity><ChartWidget type={'LIQUIDITY'} title={'ChartLiquidity'}></ChartWidget></ChartLiquidity>
                    <ChartVolume><ChartWidget type={'VOLUME'} title={'ChartVolume'} value={totalVolume}></ChartWidget></ChartVolume>
                    <ChartTxByChain><ChartWidget type={'TXCHAIN'} title={'ChartTxByChain'}></ChartWidget></ChartTxByChain>
                    <ChartTx><ChartWidget type={'TX'} title={'Transactions'} value={6544}></ChartWidget></ChartTx>
                </ChartContainer>
                <TopLiquidity title={'Top Liquidity'} />
            </WrapStats>

        </StatsContainer>
    )
}
