import BarChart from 'components/Chart'
import ColumnChart from 'components/ColumnChart'
import useStatInArray from 'hooks/useDailyTx'
import useLiquidityData from 'hooks/useLiquidityData'
import useTotalTxByChain from 'hooks/useTotalTxByChain'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
const numeral = require('numeral')

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
const WidgetContainer = styled.div`
width: 585px;
height: 348px;
background: linear-gradient(4.66deg, rgba(102, 102, 102, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
mix-blend-mode: normal;
backdrop-filter: blur(100px);
/* Note: backdrop-filter has minimal browser support */

border-radius: 30px;
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 40px;
    padding-right: 40px;
    padding-top: 25px;
`
const HeaderInfo = styled.div`

`
const ValueBlock = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: right;
    color: #FFFFFF;
`
const TimeBlock = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 15px;
    text-align: right;
    color: #38E4DE;
`

const ChainButton = styled.button`
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    color: #FFFFFF;
    width: 82px;
    height: 28px; 
    background: #301662;
    border-radius: 50px;
`
type ChartWidgetProps = {
    title: string
    type: string
    data?: []
    value?: number
}
export function ChartWidget({ title, data, type, value }: ChartWidgetProps) {
    const onSelectedValue = (selectedValue?: number, selectedPerc?: number) => {

    }
    type ChartData = {
        categoriesX: string[]
        series: number[]
    }
    type ChartColumnData = {
        name: string
        y: number
    }
    const [chartData, setChartData] = useState({} as ChartData)
    const initColumnData: ChartColumnData[] = []
    const [chartColumnData, setChartColumnData] = useState(initColumnData)
    const [isNotLoadTxBychain, setLoadTxByChain] = useState(true)
    const paths = {
        'TX': 'daily_txns',
        'VOLUME': 'daily_bridged_value',
        'TXCHAIN': '',
        'LIQUIDITY': ''

    }
    const chains = ['AVAX', 'movr', 'matic', 'eth', 'ht', 'ftm', 'iotx', 'sdn', 'cro', 'bnb', 'one']
    const totalTxByChains = useTotalTxByChain(chains)
    const totalLiquidity = useLiquidityData(chains)

    const statData = useStatInArray(paths[type])

    useEffect(() => {
        if (totalTxByChains.length && ['TXCHAIN'].includes(type)) {
            const seriesData: ChartColumnData[] = []
            totalTxByChains.map((item: any, ind: number) => {
                const oneItem = {} as ChartColumnData
                oneItem.name = chains[ind].toUpperCase()
                oneItem.y = item.status === 'fulfilled' ? item.value['Total Txn'] : 0

                seriesData.push(oneItem)
            })

            setChartColumnData(seriesData)

        }
    }, [totalTxByChains])
    useEffect(() => {
        console.log('type :>> ', type);
        if (totalLiquidity.length && ['LIQUIDITY'].includes(type)) {
            const seriesData: ChartColumnData[] = []
            totalLiquidity.map((item: any, ind: number) => {
                const oneItem = {} as ChartColumnData
                oneItem.name = chains[ind].toUpperCase()
                oneItem.y = item.status === 'fulfilled' ? item.value['Total Txn'] : 0

                seriesData.push(oneItem)
            })
            console.log('seriesData LIQUIDITY:>> ', seriesData);
            setChartColumnData(seriesData)

        }
    }, [totalLiquidity])
    useEffect(() => {

        if (type === 'TX' && statData?.length) {
            const data = {} as ChartData
            data.series = []
            data.categoriesX = []
            statData.map(item => {
                data.series.push(item['Transactions'])
                data.categoriesX.push(`${new Date(item['Date Received']).getDate()}`)
            })
            setChartData(data)
        }
        if (type === 'VOLUME' && statData?.length) {
            const data = {} as ChartData
            data.series = []
            data.categoriesX = []
            statData.map(item => {
                data.series.push(item['Value Bridged'])
                data.categoriesX.push(`${new Date(item['Date Received']).getDate()}`)
            })
            setChartData(data)
        }

    }, [statData])
    const getInfoForChart = () => {
        console.log('chartColumnData :>> ', chartColumnData);
        const now = new Date()

        const utcTime = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}${now.getFullYear()} (UTC)`
        return (
            <>
                {
                    ['VOLUME', 'TX'].includes(type) &&
                    <>
                        <ValueBlock>
                            {type === 'VOLUME' ? '$ ' : ''}{numeral(value).format('0,0.00')}

                        </ValueBlock>
                        <TimeBlock > {utcTime}</TimeBlock>
                    </>}
                {type === 'TXCHAIN' && <ChainButton >{'All Time'}</ChainButton>}

            </>
        )
    }
    return (
        <WidgetContainer>
            <Header>
                <Title>{title}</Title>
                <HeaderInfo>
                    {getInfoForChart()}
                </HeaderInfo>
            </Header>

            {['VOLUME', 'TX'].includes(type) && <BarChart onSelectedValue={onSelectedValue}
                categoriesX={chartData?.categoriesX}
                series={chartData?.series}
                lineChartWidth={500} barColor={type} typeChart={type} ></BarChart>}
            {['TXCHAIN', 'LIQUIDITY'].includes(type) && <ColumnChart chartData={chartColumnData} typeChart={type}></ColumnChart>}
        </WidgetContainer>
    )
}