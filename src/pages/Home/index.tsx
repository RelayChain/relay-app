
import { Academy } from 'components/AcademyWidget'
import { LogoCarousel } from 'components/LogoCaroucel'
import { Partners } from 'components/Partners'
import { Link } from 'react-router-dom';
import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ButtonWhite, ButtonTransparent, ButtonPink } from '../../components/Button'

export function Home() {

    const HomeWrapper = styled.div` 
    display: flex; 
    flex-direction: column;
    `

    const TableWrapper = styled.div` 
    display: flex;  
    flex-direction: column;
    position: relative; 
    margin-bottom: 50px;
    `
    const SecondPage = styled.div`
    display: flex;  
    height: 300px;
    position: relative; 
    flex-direction: column;
    align-items: center;
    `
    const TitleTable = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 35px;
    line-height: 55px; 
    color: #00DFFF;
    `
    const MiddleTable = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 80px;
    line-height: 80px;
    color: white;  
    `

    const FooterTable = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 35px;
    line-height: 55px;
    color: white;  
    `
    const ButtonsWrapper = styled.div`
        position: relative;
        display: flex;
        margin-top: 50px;
    `

    const ButtonHomeLight = styled(ButtonPink)`
        margin-right: 30px;
        width: 200px;
        height: 50px;
        background: linear-gradient(90deg, #AD00FF 0%, #7000FF 100%);
        border-radius: 100px;
    `

    const ButtonHomeTransparent = styled(ButtonTransparent)`
        margin-right: 30px;
        width: 200px;
        height: 50px;
        border-radius: 100px;
    `

    const TransactionSpeed = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    left: 200px; 
    `
    const SpacemanBlock = styled.div`
    position: absolute;
    left: 0px;
    top: -190px;
    width: 480px; 
    height: 570px;
    `

    const Widget = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 
    width: 160px;
    height: 120px;
    :hover{
        background: linear-gradient(180deg, rgba(173, 0, 255, 0.25) 0%, rgba(97, 0, 143, 0.25) 100%);
        mix-blend-mode: normal;
        border-radius: 30px;
    }
    div {
        font-family: Montserrat;
        font-style: normal;
        font-weight: 500;
        font-size: 50px;
        line-height: 61px;
        text-align: center;
        color: #FFFFFF;
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
    const TxSpeedWidgets = styled.div` 
        display: flex;
        flex-wrap: wrap;
    `
    const BlockWidgets = styled.div` 
    display: flex; 
    flex-direction: column;
    width: 40%;
`
    const VideoBlock = styled.div` 
    position: relative;
    height: 600px;
    width: 100%;
    margin: 100px 0;
    z-index: 1;
    div {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 90px;
        height: 65px;
    }
`
    const TriangleBlock = styled.img` 
        position: absolute;
        left: calc(50% - 70px);
        top: calc(50% - 80px);
`
    const CircleBlock = styled.img` 
        position: absolute;
        left: calc(50% - 65px);
        top: calc(50% - 80px);
`
    const SenseBlock = styled.div` 
    position: relative;
    margin-top: 40px;
    width: 970px;
    margin: 0 auto;
    `
    const SenseBackgroundBlock = styled.img` 
    position: absolute;
    width: 656px;
    height: 655px;
    top: 80px;
    left: 155px;
    `
    const SecurityBlock = styled.div` 
    margin: 100px 0; 
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center; 
    align-items: center;
`
    const MiddleTitle = styled.div` 
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 55px;
    color: #7F46F0;
    `
    const SenseTitle = styled(MiddleTitle)`
    text-align: center;
    `
    const TitleSecBlock = styled(MiddleTitle)`
        margin-bottom: 20px;
        width: 40%;
        text-align: start;
    `
    const SecurityInfo = styled.div`
        width: 40%;
`
    const SecuritySpaceman = styled.div`
    position: absolute;
    left: 66%; 
    height: 350px;
    width: 300px 
`

    const WorkBlock = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 50px;
    `
    const AcademyBlock = styled.div` 
    position: relative; 
    display: flex;
    flex-direction: column;
    align-items: center;
`
    const AcContent = styled(Academy)`
    grid-area: ac-content;
    `
    const TitleAcademy = styled.div`
    text-align: right;
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    color: #7F46F0;
    grid-area: title-ac;
    text-align: center;
    `
    const LogoAcademy = styled.img` 
        width: 80px;
        height: 80px;
        position: absolute;
        left: -100px;
        top: 20px;
    `
    const Logo1 = styled.img` 
    width: 60px;
    height: 20px;
    color: red;
    `
    const Logo2 = styled.div`
    grid-area: logo-2;
    `

    const WorkWidget = styled.div`
    width: 300px;
    height: 400px;
    background: rgba(70, 70, 70, 0.25);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        margin-top: 60px;
        width: 200px;
        height: 200px; 
    }
    div {
        font-family: Montserrat;
        font-style: normal;
        font-weight: bold;
        font-size: 28px;
        line-height: 34px;
        text-align: center;
        color: #7F46F0;
        margin-top: 20px;
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
    const InvestorBlock = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 960px;
    height: 313px;
    background: linear-gradient(180deg, rgba(0, 91, 175, 0.5) 0%, rgba(0, 209, 255, 0.5) 100%);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    padding: 25px;
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

const InvButtonsWrapper = styled(ButtonsWrapper)`
margin-top: 10px;
`
    const WrapperPage1 = styled.div` 
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
 `

    const HomeContainer = styled.div`
    position: relative;
    left: 250px;
    top: 342px;
 `
    const SpacemanBlock1 = styled.div` 
    position: absolute; 
    height: 667px;
    width: 600px;
    top: -35px;
    left: 790px;
 `

    const FirstWrapper = styled.div`   
    position: relative;
    width: 100%;
    height: 1140px;
    left: 0;
    top: -60px;
    `
    const PartnersBlock = styled.div`
    position: relative; 
    display: grid;
    justify-content: center;
    align-content: center; 
    margin: 100px 0;
`

    const PartnersTitle = styled(MiddleTitle)`
        text-align: center;
        margin-bottom: 50px;
    `
    const TxSpeedTitle = styled(MiddleTitle)`
        text-align: center;
    `
    const AcademyHead = styled.div`
        display: flex;
        flex-direction: column;
        position: relative;
        margin-bottom: 50px;
    `
    const LogoBlock = styled.div`
    display: flex;
    `
    const InvestorTitle = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: 700;
    font-size: 60px;
    line-height: 55px;
    text-align: center;
    color: #FFFFFF;
    `
    const getWidgets = () => {
        const widgetsData = [
            { speedValueinPercent: 93, description: 'under 20 min' },
            { speedValueinPercent: 85, description: 'under 6 min' },
            { speedValueinPercent: 77, description: 'under 5 min' },
            { speedValueinPercent: 60, description: 'under 5 min' },
            { speedValueinPercent: 35, description: 'under 3 min' },
            { speedValueinPercent: 10, description: 'Of Txs is sent in under 2 minutes' },

        ]
        return (
            <>
                {widgetsData.map(widget => <Widget>
                    <div>{widget.speedValueinPercent} %</div>
                    <p>{widget.description}</p>
                </Widget>)}
            </>
        )
    }
    return (
        <>
            <HomeWrapper>
                <FirstWrapper className="space-bg">
                    <HomeContainer>
                        <TableWrapper>
                            <TitleTable>Explore cross chain token transfers on
                                <MiddleTable>the World’s Top </MiddleTable>
                                <MiddleTable> Blockchains </MiddleTable>
                                <FooterTable> using Relay’s simple, fast, and secure <b>bridge</b> </FooterTable>

                            </TitleTable>

                            <ButtonsWrapper>
                                <ButtonHomeLight>Launch the App</ButtonHomeLight>
                                <ButtonHomeTransparent>Learn More</ButtonHomeTransparent>
                                <ButtonHomeLight>Buy Relay</ButtonHomeLight>
                            </ButtonsWrapper>
                        </TableWrapper>


                        <SpacemanBlock1 className="spaceman"></SpacemanBlock1>
                    </HomeContainer>

                </FirstWrapper>
                <SecondPage>
                    <MiddleTitle>Easily Transfer</MiddleTitle>
                    <p>tokens between our supported blockchains</p>
                    <LogoCarousel countLogosToShow={8} />
                </SecondPage>
                <TransactionSpeed>
                    <SpacemanBlock className="spaceman-2" />
                    <BlockWidgets>
                        <TxSpeedTitle>Transaction Speed</TxSpeedTitle>
                        <TxSpeedWidgets className="box" >

                            {getWidgets()}
                        </TxSpeedWidgets>
                    </BlockWidgets>

                </TransactionSpeed>
                <VideoBlock className="video-block">
                    <div>
                        <TriangleBlock src={require('../../assets/svg/triangle.svg')} />
                    </div>
                    <CircleBlock src={require('../../assets/svg/circle.svg')} />
                </VideoBlock>


                <SenseTitle>How it works</SenseTitle>
                <SenseBlock>
                    <SenseBackgroundBlock src={require('../../assets/images/Ellipse.png')} />
                    <WorkBlock>
                        <WorkWidget>
                            <img src={require('../../assets/images/new-design/wallet.png')} />
                            <div>Connect wallet</div>
                            <p>{`Chouse your wallet
                                  to connect`} </p>
                        </WorkWidget>
                        <WorkWidget>
                            <img src={require('../../assets/images/new-design/wallet.png')} />
                            <div>Bridge Token</div>
                            <p>Choose your token and your destination chain</p>
                        </WorkWidget>
                        <WorkWidget>
                            <img src={require('../../assets/images/new-design/wallet.png')} />
                            <div>Receive Tokens</div>
                            <p>Receive your tokens on the destination chain</p>
                        </WorkWidget>
                    </WorkBlock>
                    <InvestorBlock>
                        <InvestorTitle>Investor Group</InvestorTitle>     
                        <p>We made the RELAY token deflationary with our unique tokenomics model utilizing buy back and burns from the bridge fees, while minimizing sell pressure by suppressing Relay emissions. 
                        Become an Investor today to earn native gas tokens (like MATIC, AVAX, MOVR, etc) through <b>Staking</b>, or partners’ tokens (QUICK, SOLAR, MOON, etc) when proving liquidity with the RELAY token as a pair through a <b>Pool</b>. </p>
                        <InvButtonsWrapper>
                                <ButtonHomeLight as={Link} to={'/pools'}>Pool</ButtonHomeLight>
                                <ButtonHomeLight as={Link} to={'/single-sided-staking'}>Staking</ButtonHomeLight>
                            </InvButtonsWrapper>
                    </InvestorBlock>
                </SenseBlock>
                <SecurityBlock>
                    <TitleSecBlock>Security</TitleSecBlock>
                    <SecurityInfo>
                        Our bridge is considered to be triple-audited.
                        RelayChain is an optimized version of the original Chainsafe code,
                        which was originally audited by CosenSys Dilligence.
                        A subsequent audit of the code and improvements was performed by Zokyo.
                        And a final audit was conducte
                    </SecurityInfo>
                    <SecuritySpaceman className="hero-security" />

                </SecurityBlock>
                <AcademyBlock>
                    <AcademyHead>
                        <LogoAcademy src={require('../../assets/images/crosschain/RELAY.png')} />
                        <TitleAcademy>Academy</TitleAcademy>
                        <LogoBlock><Logo1 src={require('../../assets/images/new-design/relay-academy.png')}></Logo1><Logo2>DEFI</Logo2></LogoBlock>
                    </AcademyHead>
                    <AcContent countLogosToShow={5} />
                </AcademyBlock>
                <PartnersBlock>
                    <PartnersTitle>Partners</PartnersTitle>
                    <Partners />
                </PartnersBlock>
            </HomeWrapper>
        </>
    )
}
