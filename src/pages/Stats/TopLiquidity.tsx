import React from 'react'
import styled from 'styled-components'

interface TopLiquidityProps {
    title: string
    // txData?: any[]
    // headerNames?: []
}

const TableTitle = styled.div`

`
function TopLiquidity({ title }: TopLiquidityProps) {
    const headerNames = ['Rank', 'Transaction hash', 'Time', 'From', 'To', 'Token', 'Amount (USD)']
    const txData = ['1', 'hjgjkhg', '1212121', 'hgkjhgjhk', 'JHKGJKH', 'UYT', '2156456']
    return (
        <div>
            <TableTitle>{title}</TableTitle>
            <table >
                <thead>
                    <tr>
                        {headerNames && headerNames?.map((name: string, ind) =>
                            <th key={name + ind}>{name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {txData && txData?.map((item, ind) => {
                        return (<tr key={`${ind}`}>
                            <td key={`${ind + 100}`}>{item}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TopLiquidity
