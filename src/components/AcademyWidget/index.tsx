import { ButtonPink } from 'components/Button'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components' 

const CarouselWrapper = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
    
    `
    const AcademyContainer = styled.div`
        display: flex;
        flex-direction: column;        
        :last-child {
            align-content: flex-start
        }
    `
const WidgetContainer = styled.div`   
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        border-radius: 30px;
        height: 280px;
        width: 200px;
        
        background: rgba(70, 70, 70, 0.25);
        mix-blend-mode: normal;
        backdrop-filter: blur(100px);
        &:not(:last-child) {
            margin-right: 20px;
        }
        img{
            width: 200px
            height: 113px;
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
        margin:  0 30px 0 10px;
    `
const DescriptionBlock = styled.p`
        font-family: Montserrat;
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 17px;        
        color: #FFFFFF;
    `

const ButtonHomeLight = styled(ButtonPink)`
        width: 168px;
        height: 60px;
        background: linear-gradient(90deg, #AD00FF 0%, #7000FF 100%);
        border-radius: 100px;
    `
const Title = styled.div`
    width: 60px;
    height: 28px; 
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #FFFFFF;
    cursor: pointer;
    margin-right: 50px;
`
const Titles = styled.div`
    display: flex;
    margin-left: 50px;
    margin-top: 50px;
`
interface LogoCarouselProps {
    countLogosToShow: number
}
export function Academy({ countLogosToShow }: LogoCarouselProps) {
    const titles = ['Avax', 'Moonriver', 'Matic', 'Harmony', 'Relay']
    const [startPositionLogos, setStartPositionLogos] = useState(0)

    const [activeTitleName, setActiveTitleName] = useState(titles[0])
    const [endPositionLogos, setEndPositionLogos] = useState(countLogosToShow)
 
    const academyInfo = [
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/movr_to_ava.png'), description: 'Send Movr from Moonriver to Avalanche', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/metamask_in_ava.png'), description: 'Add Avalanche network to Metamask', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/usdt_to_shiden.png'), description: 'Send USDT.e from the avalanche network to the shiden network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/avax_to_harm.png'), description: 'Send Avax from Avalanche network to Harmony Network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/movr_to_ava.png'), description: 'Send Movr from Moonriver to Avalanche', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/metamask_in_ava.png'), description: 'Add Avalanche network to Metamask', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/usdt_to_shiden.png'), description: 'Send USDT.e from the avalanche network to the shiden network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/avax_to_harm.png'), description: 'Send Avax from Avalanche network to Harmony Network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Avax', imageUrl: require('../../assets/images/new-design/academy/movr_to_ava.png'), description: 'Send Movr from Moonriver to Avalanche', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Moonriver', imageUrl: require('../../assets/images/new-design/academy/usdt_to_shiden.png'), description: 'Send USDT.e from the avalanche network to the shiden network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Moonriver', imageUrl: require('../../assets/images/new-design/academy/avax_to_harm.png'), description: 'Send Avax from Avalanche network to Harmony Network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Relay', imageUrl: require('../../assets/images/new-design/academy/usdt_to_shiden.png'), description: 'Send USDT.e from the avalanche network to the shiden network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Relay', imageUrl: require('../../assets/images/new-design/academy/avax_to_harm.png'), description: 'Send Avax from Avalanche network to Harmony Network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Relay', imageUrl: require('../../assets/images/new-design/academy/usdt_to_shiden.png'), description: 'Send USDT.e from the avalanche network to the shiden network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },
        { title: 'Relay', imageUrl: require('../../assets/images/new-design/academy/avax_to_harm.png'), description: 'Send Avax from Avalanche network to Harmony Network', videoUrl: 'https://www.youtube.com/watch?v=uHrBWHNl2Nc&ab_channel=DappRadar' },

    ]

    type academy = typeof academyInfo;
    let filteredInfo: academy = academyInfo.filter(info => info.title === activeTitleName)
     

    useEffect(() => {
        filteredInfo = academyInfo.filter(info => info.title === activeTitleName)
    }, [activeTitleName])
    const openInNewTab = (url: string): void => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onClickUrl = (url: string)  => openInNewTab(url)

    const fillItems = () => {
        return filteredInfo.map((item, ind) => {

            return (
                <>{
                    startPositionLogos >= ind || ind <= endPositionLogos &&
                    <WidgetContainer key={ind}>
                        <img src={item.imageUrl}></img>
                        <DescriptionBlock>{item.description}</DescriptionBlock>
                        <ButtonHomeLight onClick={() => onClickUrl(item.videoUrl)}>Watch video</ButtonHomeLight>
                    </WidgetContainer>
                }</>
            )
        })
    }

    const fillTitles = () => {
        return (
            titles.map(title => <Title className={title === activeTitleName ? "active-title" : ""} onClick={() => setActiveTitleName(title)}>{title}</Title>)
        )
    }
    const increase = () => {
        if (endPositionLogos < filteredInfo.length) {
            setEndPositionLogos(endPositionLogos + 1)
            setStartPositionLogos(endPositionLogos - countLogosToShow)
        }
    }

    const decrease = () => {
        if (startPositionLogos > 0) {
            setStartPositionLogos(startPositionLogos - 1)
            setEndPositionLogos(startPositionLogos + countLogosToShow)
        }
    }
    // useEffect(() => {

    // }, [endPositionLogos, startPositionLogos])
    return (
        <AcademyContainer>
            {filteredInfo.length > 0 && <CarouselWrapper>
                <Arrow src={require('../../assets/images/new-design/arrow-left.svg')} onClick={() => increase()} />
                {fillItems()}
                <Arrow src={require('../../assets/images/new-design/arrow-right.svg')} onClick={() => decrease()} />
            </CarouselWrapper>}
            <Titles>{fillTitles()}</Titles>
        </AcademyContainer>
    )
}