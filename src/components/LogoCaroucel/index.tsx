import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import ArrowLeft from '../../assets/images/new-design/arrow-left.svg'
const CarouselWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 600px;
    // &:nth-child(1) {
    //     margin-right: 50px;
    // }

`
const LogoContainer = styled.div`   
    display: flex;
    flex-direction: column;
    align-items: center
    height: 80px;
    img{
        width: 24px
        height: 24px;
    }
    p {
        font-family: Montserrat;
        font-style: normal;
        font-weight: 300;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
        color: #FFFFFF;
    }    

`
const Arrow = styled.img`
    cursor: pointer;
`



interface LogoCarouselProps {
    countLogosToShow: number
}
export function LogoCarousel({countLogosToShow}: LogoCarouselProps ) {
    const [startPositionLogos, setStartPositionLogos] = useState(0)
    const [endPositionLogos, setEndPositionLogos] = useState(countLogosToShow)
    const logos = [
        { iconUrl: require('../../assets/images/ethereum-logo.png'), name: 'Ethereum' },
        { iconUrl: require('../../assets/images/avax-logo.png'), name: 'Avalanche' },
        { iconUrl: require('../../assets/images/ethereum-logo.png'), name: 'Ethereum' },
        { iconUrl: require('../../assets/images/avax-logo.png'), name: 'Avalanche' },
        { iconUrl: require('../../assets/images/avax-logo.png'), name: 'Avalanche' },
        { iconUrl: require('../../assets/images/ethereum-logo.png'), name: 'Ethereum' },
        { iconUrl: require('../../assets/images/avax-logo.png'), name: 'Avalanche' },
        { iconUrl: require('../../assets/images/ethereum-logo.png'), name: 'Ethereum' },
        { iconUrl: require('../../assets/images/crosschain/heco-icon.png'), name: 'Heco' },

    ]
    const fillItems = () => {
        return logos.map((item, ind) => {

            return (
                <>{
                    startPositionLogos >= ind || ind <= endPositionLogos && <LogoContainer key={ind}>
                    <img src={item.iconUrl}></img>
                    <p>{item.name}</p>
                </LogoContainer>
                }</>
            )
        })
    }
    const increase = () => {
        if(endPositionLogos  < logos.length) {
            setEndPositionLogos(endPositionLogos + 1)
            setStartPositionLogos(endPositionLogos - countLogosToShow)
        }
    }

    const decrease = () => {
        if(startPositionLogos > 0) {
            setStartPositionLogos(startPositionLogos - 1)
            setEndPositionLogos(startPositionLogos + countLogosToShow)
        }
    }
    // useEffect(() => {

    // }, [endPositionLogos, startPositionLogos])
    return (
        <>
            <CarouselWrapper>
                <Arrow src={ require('../../assets/images/new-design/arrow-left.svg')} onClick={() => increase()}/>
                {fillItems()}
                <Arrow src={ require('../../assets/images/new-design/arrow-right.svg')} onClick={() => decrease()}/>
            </CarouselWrapper>
        </>
    )
}