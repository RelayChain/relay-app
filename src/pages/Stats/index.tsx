import { ChartWidget } from 'components/ChartWidget'
import React, { Component } from 'react'
import styled from 'styled-components'
import Widget from './Widget'


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
    justify-content: space-around;
    margin-top: 105px;

`
const ChartContainer = styled.div`
    display: grid;
    grid-template-areas: 
    "chartLiq chartVol"
    "chartTxChain chartTx";
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    height: 300px;
    margin: 0;
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
const TopLiquidity = styled.div`
text-align: center;
height: 50px;
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
    width: 90vw;
    heigth: 90vh;
`
export default function Stats({ }) {



    return (
        <StatsContainer>
            <StatsTitle>Dashboard</StatsTitle>
            <WidgetContainer>
                <TvlWidget>
                    <Widget type={'TVL'} title={'TVL'}></Widget>
                </TvlWidget>
                <TxWidget>
                    <Widget type={'TX'} title={'Total Txns'}></Widget>
                </TxWidget>
                <FeeWidget>
                    <Widget type={'FEES'} title={'Total Fees'}></Widget>
                </FeeWidget>
            </WidgetContainer>

            <ChartContainer>
                <ChartLiquidity><ChartWidget title={'ChartLiquidity'}></ChartWidget></ChartLiquidity>
                <ChartVolume><ChartWidget title={'ChartVolume'}></ChartWidget></ChartVolume>
                <ChartTxByChain><ChartWidget title={'ChartTxByChain'}></ChartWidget></ChartTxByChain>
                <ChartTx><ChartWidget title={'ChartTx'}></ChartWidget></ChartTx>
            </ChartContainer>
            <TopLiquidity title={'Top Liquidity'}  > </TopLiquidity>
        </StatsContainer>
    )
}
