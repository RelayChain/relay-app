import { getCurrencyLogoImage, getLogoByName } from 'components/CurrencyLogo'
import useTopLiquidity from 'hooks/useTopLiquidity'
import React from 'react'
import styled from 'styled-components'

interface TopLiquidityProps {
    title: string
    // txData?: any[]
    // headerNames?: []
}

export interface ITopLiquidity {
    token: string
    maxTransferSize: number
    totalLiquidity: number
    volume: number
    proportion: number
}

const TableTitle = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    color: #FFFFFF;
    margin-left: 50px;
    margin-bottom: 20px;
`
const LiquidityInfo = styled.div`
    background: linear-gradient(4.66deg, rgba(102, 102, 102, 0.2) 3.92%, rgba(255, 255, 255, 0) 96.38%);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    margin-top: 10px;
    padding: 10px;
    width: 100%;
`
const StyledTr = styled.tr`
    width: 50px;
`
const StyledTh = styled.th`
    width: 21%;
    font-family: Poppins;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #FFFFFF;
    &:nth-child(1) {
        width: 10%;
    }
`
const StyledTd = styled.td`
    width: 21%;
    text-align: center;
    font-family: Poppins;
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #FFFFFF;
    &:nth-child(1) {
        width: 10%;
    }
`
const StyledTable = styled.table`
    padding-right: 25px;
`
const TokenBlock = styled.div`
    display: flex;
    align-items: center;
`
const LogoBlock = styled.img`
    margin-left: 30px;
    margin-right: 10px;
`
function TopLiquidity({ title }: TopLiquidityProps) {
    const headerNames = ['#', 'Token', 'Max Transfer Size', 'Total Liquidity', 'Volume (USD)', 'Proportion']
    const txData = useTopLiquidity()


    const getRowsWithData = (data: ITopLiquidity) => {
        let content = [];
        let classIndex = 1;
        for (let cell in data) {
            let item = null

            content.push(
                < StyledTd key={classIndex} > {handleCellType(cell, data[cell])}</StyledTd >
            )
            classIndex++
        }
        return content;
    };
    const handleCellType = (name: string, value: any) => {
        if (name === 'token') {
            const logoName = getCurrencyLogoImage(value)
            return <TokenBlock><LogoBlock src={getLogoByName(logoName)} alt="" /><div>{value}</div></TokenBlock>
        } else {
            return value
        }

    }
    return (
        <LiquidityInfo>
            <TableTitle>{title}</TableTitle>
            <StyledTable>
                <thead>
                    <tr>
                        {headerNames && headerNames?.map((name: string, ind) =>
                            <StyledTh key={name + ind}>{name}</StyledTh>)}
                    </tr>
                </thead>
                <tbody>
                    {
                        txData && txData?.map((item, ind) => {
                            return (
                                <tr key={`${ind + 300}`}>
                                    <StyledTd key={`${ind + 100}`}>{ind}</StyledTd>
                                    {getRowsWithData(item)}
                                </tr>
                            )
                        })
                    }


                </tbody>
            </StyledTable>
        </LiquidityInfo >
    )
}

export default TopLiquidity
