import React from 'react'
import styled from 'styled-components'

interface WidgetProps {
    type: string
    title: string
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
const ChartBlock = styled.div`
width: 84px;
height: 84px;
background: linear-gradient(180deg, #FF008A 0%, #BD00FF 100%);

`
const WidgetInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
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
    /* identical to box height */


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
function Widget({ type, title }: WidgetProps) {
    return (
        <WidgetContainer>
            <ChartBlock>Chart</ChartBlock>
            <WidgetInfo>
                <WidgetTitle>{title}</WidgetTitle>
                <WidgetValueBlock>{'1515,545'}</WidgetValueBlock>
                {type === 'TX' && <TxInfoBlock>{'4365 txns more than yesterday'}</TxInfoBlock>}
            </WidgetInfo>
        </WidgetContainer>
    )
}

export default Widget
