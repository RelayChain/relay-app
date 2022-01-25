import { ButtonOutlined } from '../Button'
import Copy from '../AccountDetails/Copy'
import React from 'react'
import styled from 'styled-components'
import { Separator } from 'components/SearchModal/styleds'
import {
  BarChart,
  BarChart2,
  Book,
  BookOpen,
  GitHub,
  Info,
  Paperclip,
  Twitter,
} from 'react-feather'
import { useCrosschainState } from 'state/crosschain/hooks'
import { getCurrencyLogoImage, getLogoByName } from 'components/CurrencyLogo'

const Title = styled.div`
  height: 47px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 32px; 
  text-align: center; 
  color: #38E4DE;
`
const Success = styled(Title)` 
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 21px;
  line-height: 26px;
  text-align: center;
  color: #FFFFFF;
`
const HashBlock = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center; 
  color: #A782F3;
`
const StyledButton = styled(ButtonOutlined)`
  width: 421px;
  height: 60px; 
  background: linear-gradient(90deg, #AD00FF 0%, #7000FF 100%);
  border-radius: 51px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 61px; 
  text-align: center; 
  color: #FFFFFF;
`
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 473px;
  height: 795px; 
  background: #2E2757;
  border: 1px solid #7F46F0;
  box-sizing: border-box;
  box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
`
const DestinationAddress = styled(Copy)`
  margin-top: 16px;
`
const StyledSeparator = styled(Separator)`
  border-bottom: 1px solid #4B408E;
`
const FooterBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 350px;

`
const SocialBlock = styled.div`
  padding: 17px;
  width: 60px;
  height: 60px;
  background: linear-gradient(360deg, rgba(43, 86, 254, 0.05) 0%, rgba(43, 86, 254, 0.1) 107%);
  backdrop-filter: blur(100px);
  border-radius: 17.33px;
`
const IconLink = styled.span`
  display: inline-block;
  margin-right: 30px;
  text-decoration: none;
  cursor: pointer;
  color: #A782F3;
`
const LogoBlock = styled.img`
  height: 25px;
  width: 25px;
`
const AssetTitle = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #FFFFFF;
`
const TokenLogo = styled.img`
  height: 60px;
  width: 60px;
  margin: -25px 0;
`
const TokenTitle = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 37px;
  text-align: center;
  color: #FFFFFF;
`
const MainBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 421px;
}
`
const ChainLogo = styled.img`
  height: 35px;
  width: 35px;
  margin: 10px;
`
const LineBlock = styled.div`
  border: 3px solid #38E4DE; 
  width: 50px;
  height: 6px;
`
const BridgeBlock = styled.div`
  position: relative;
  border-radius: 50%;
  width: 144px;
  height: 144px;
  position: relative;
  border-radius: 50%;
  border: 6px solid #38E4DE; 
`
const BrandBlock = styled.img`
  position: absolute; 
  height: 60px;
  width: 60px;
  top: 35px;
  left: 35px; 
`
const UnderFooter = styled.div`
  position: relative;
  height: 50px;
  width: 421px;
  margin-top: 25px;

`
const UnderFooterImage = styled.img`
  position: absolute; 
  height: 50px;
  width: 50px;
  left: 185px;
  bottom: 25px;
`

export default function TransferComplete({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken,
  targetTokenAddress
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
  targetTokenAddress?: string
}) {
  const { currentTokenImage, currentChain, targetChain, currentTxID } = useCrosschainState()
  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const getImageByName = (tokenName: string) => {
    return require(`../../assets/images/${tokenName}.svg`)
  }

  return (
    <SuccessContainer>
      <Title>Success Transaction</Title>
      <StyledSeparator />
      <Success>Operation complete!</Success>
      <HashBlock>Hash: {currentTxID}</HashBlock>
      <AssetTitle>
        Asset/Token
      </AssetTitle>
      <TokenLogo src={currentTokenImage} />
      <TokenTitle>
        {currentToken?.name}
      </TokenTitle>
      <MainBlock>
        <ChainLogo src={getLogoByName(getCurrencyLogoImage(currentChain?.symbol?.toUpperCase()) || 'ETH')} />
        <LineBlock></LineBlock>
        <BridgeBlock>
          <BrandBlock src={require('../../assets/images/relay-icon.png')} />
        </BridgeBlock>
        <LineBlock></LineBlock>
        <ChainLogo src={getLogoByName(getCurrencyLogoImage(targetChain?.name?.toUpperCase()) || 'ETH')} />
      </MainBlock>
      <StyledButton onClick={onDismiss}>DONE</StyledButton>
      <UnderFooter>
        <UnderFooterImage src={require('../../assets/svg/share.svg')} />
        <StyledSeparator />
      </UnderFooter>

      <FooterBlock>
        <SocialBlock>
          <IconLink onClick={() => openInNewTab("https://twitter.com/relay_chain")}>
            <Twitter size={25} />
          </IconLink>
        </SocialBlock>
        <SocialBlock>
          <IconLink onClick={() => openInNewTab('https://t.me/relaychaincommunity')}>
            <LogoBlock src={getImageByName('telegram')} />
          </IconLink>
        </SocialBlock>
        <SocialBlock>
          <IconLink onClick={() => openInNewTab('https://t.me/relaychaincommunity')}>
            <Twitter size={25} />
          </IconLink>
        </SocialBlock>
      </FooterBlock>
    </SuccessContainer>
  )
}
