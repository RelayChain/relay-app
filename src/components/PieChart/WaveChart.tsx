import React from 'react'
import styled from 'styled-components'

type WaveChartProps = {
    valueTop: number, valueBottom: number
}
const WaveContainer = styled.div`
position: relative;
height: 84px;
width:84px;
clip-path: circle(45%);
`
const TopBlock = styled.div`
height: 47%;
width:84px;
background: #666666;

`
const BottomBlock = styled.div`
height: 53%;
width:84px;
background: #bd00ff;

`
const LabelBlock = styled.div`
position: absolute;
top: 33px;
left: 25px;
font-family: Montserrat;
font-style: normal;
font-weight: bold;
font-size: 19px;
line-height: 23px;
text-align: center;
color: #FFFFFF;
`



function WaveChart({ valueTop, valueBottom }: WaveChartProps) {
    return (
        <WaveContainer>
            <TopBlock className="wave" />
            <BottomBlock />
            <LabelBlock >{valueBottom}%</LabelBlock>
        </WaveContainer>
    )
}

export default WaveChart
