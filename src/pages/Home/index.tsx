import { LogoSlider } from 'components/LogoSlider'
import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ButtonWhite, ButtonTransparent, ButtonPink } from '../../components/Button'

export function Home() {

    const HomeWrapper = styled.div`
    display: flex; 
    flex-direction: column;
    `

    const TableWrapper = styled.div`
    grid-area: tw;
    display: flex;  
    height: 252px;
    left: 249px;
    `
    const SecondPage = styled.div`
    display: flex;  
    height: 200px;
    left: 249px;
    position: relative; 
    flex-direction: column;
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
    line-height: 55px;
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
        grid-area: bw;
        left: 249px;
        display: flex;
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
    `
    const SpacemanBlock = styled.div`
    width: 300px; 
    height: 300px;
    `
    const Widget = styled.div` 
    width: 100px;
    height: 50px;
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
`
    const SenceBlock = styled.div` 
    position: relative;
    left: 500px;
    width: 700px;
    height: 700px;
    `
    const SecurityBlock = styled.div`  
    position: relative; 
    left: 500px;
    display: grid;
    justify-content: center;
    align-content: center;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    grid-template-areas: "title-sec spaceman-3"
                         "info-sec spaceman-3"
                        
`
    
    const TitleSecBlock = styled.div`
        text-align: right;
        font-family: Montserrat;
        font-style: normal;
        font-weight: bold;
        font-size: 60px;
        line-height: 55px;
        color: #7F46F0;
        grid-area: title-sec;
    `
    const SecurityInfo = styled.div`
    text-align: right;
    grid-area: info-sec; 
`
    const SecuritySpaceman = styled.div` 
    grid-area: spaceman-3; 
    height: 500px;
`

    const WorkBlock = styled.div`
    display: flex;
    `
    const EmptyBlock = styled.div`
    height: 100px;
    grid-area: eb;
    `

    const Academy = styled.div` 
    position: relative; 
    display: grid;
    justify-content: center;
    align-content: center;
    grid-template-columns: 150px 150px 150px;
    grid-template-rows: 1fr 1fr;
    align-items: center;
    grid-template-areas: "logo-ac title-ac title-ac"
                         "logo-ac logo-1 logo-2"

`
    const TitleAcademy = styled.div`
    text-align: right;
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    color: #7F46F0;
    grid-area: title-ac;
    `
    const LogoAcademy = styled.div`
    grid-area: logo-ac;
    `
    const Logo1 = styled.div`
    grid-area: logo-1;
    `
    const Logo2 = styled.div`
    grid-area: logo-2;
    `

    const WorkWidget = styled.div`
    width: 297px;
    height: 409px;
    background: rgba(70, 70, 70, 0.25);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
    `
    const InvestorBlock = styled.div`
    width: 600px;
    height: 313px;
    background: linear-gradient(180deg, rgba(0, 91, 175, 0.5) 0%, rgba(0, 209, 255, 0.5) 100%);
    mix-blend-mode: normal;
    backdrop-filter: blur(100px);
    border-radius: 30px;
`
    const MiddleTitle = styled.div` 
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 55px;
    color: #7F46F0;
    `
    const WrapperPage1 = styled.div` 
    position: relative;
    top: 420px;
    left: 470px;
    display: grid;
    justify-content: center;
    align-content: center;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas: "tw spaceman"
                         "bw spaceman"
                         "eb spaceman"

 `

    const SpacemanBlock1 = styled.div` 
    grid-area: spaceman;
    height: 560px
    width: 500px;
 `

    const FirstWrapper = styled.div` 
 position: relative;
 top: -100px;
`
    const getWidgets = () => {
        const widgets = ['Widget1', 'Widget2', 'Widget3', 'Widget4', 'Widget5', 'Widget6']
        return (
            <>
                {widgets.map(widget => <Widget>{widget}</Widget>)}
            </>
        )
    }
    return (
        <>
            <HomeWrapper>
                <FirstWrapper className="space-bg">
                    <WrapperPage1 >
                        <TableWrapper>
                            <TitleTable>Explore cross chain token transfers on
                                <MiddleTable>the World’s Top </MiddleTable>
                                <MiddleTable> Blockchains </MiddleTable>
                                <FooterTable> using Relay’s simple, fast, and secure <b>bridge</b> </FooterTable>

                            </TitleTable>

                        </TableWrapper>

                        <ButtonsWrapper>
                            <ButtonHomeLight>Launch the App</ButtonHomeLight>
                            <ButtonHomeTransparent>Learn More</ButtonHomeTransparent>
                            <ButtonHomeLight>Buy Relay</ButtonHomeLight>
                        </ButtonsWrapper>
                        <EmptyBlock />
                        <SpacemanBlock1 className="spaceman"></SpacemanBlock1>
                    </WrapperPage1>
                </FirstWrapper>


                <SecondPage>
                    <MiddleTitle>Easily Transfer</MiddleTitle>
                    <p>tokens between our supported blockchains</p>
                    <LogoSlider />
                </SecondPage>
                <TransactionSpeed>
                    <SpacemanBlock className="spaceman-2" />
                    <BlockWidgets>
                        <MiddleTitle>Transaction Speed</MiddleTitle>
                        <TxSpeedWidgets className="box" >

                            {getWidgets()}
                        </TxSpeedWidgets>
                    </BlockWidgets>

                </TransactionSpeed>
                <VideoBlock className="video-block"></VideoBlock>


                <MiddleTitle>How it works</MiddleTitle>
                <SenceBlock className="ellipse">
                    <WorkBlock>
                        <WorkWidget>WorkWidget1</WorkWidget>
                        <WorkWidget>WorkWidget2</WorkWidget>
                        <WorkWidget>WorkWidget3</WorkWidget>
                    </WorkBlock>
                    <InvestorBlock>
                        InvestorBlock
                    </InvestorBlock>
                </SenceBlock>
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
<Academy>
    <LogoAcademy>LogoAcademy</LogoAcademy>
<TitleAcademy>Academy</TitleAcademy>
<Logo1>RELAY</Logo1><Logo2>DEFI</Logo2>
</Academy>

            </HomeWrapper>
        </>
    )
}