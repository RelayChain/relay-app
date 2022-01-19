import React from 'react'
import styled from 'styled-components'
import {
  BarChart,
  BarChart2,
  Book,
  BookOpen,
  GitHub,
  Info,
  Paperclip,
  Twitter,
  Youtube
} from 'react-feather'

const Container = styled.div`
  width: 100%;
  height: 124px; 
  backdrop-filter: blur(28px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 15px 25px;
    margin-bottom:86px;
  `};
`
const ItemFooter = styled.div`
  padding: 5px;
  color: white;
  cursor: pointer;
`
const IconLink = styled.span`
  display: inline-block;
  margin-right: 30px;
  text-decoration: none;
  cursor: pointer;
`
const LogoBlock = styled.img`
  height: 20px;
  width: 20px;
`
const FooterTitile = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 21px; 
  text-align: center;
  color: #A782F3;
`


export function Footer() {
  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const onClickUrl = (url: string) => openInNewTab(url)


  const getLogoByName = (tokenName: string) => {
    return require(`../../assets/images/${tokenName}.svg`)
  }

  return (
    <>
      <Container>
        <IconLink onClick={() => onClickUrl('https://t.me/relaychaincommunity')}>
          <LogoBlock src={getLogoByName('telegram')} />
        </IconLink>

        <IconLink onClick={() => onClickUrl("https://www.reddit.com/r/RelayChain/")}>
          <LogoBlock src={getLogoByName('reddit')} />
        </IconLink>

        <IconLink onClick={() => onClickUrl("https://github.com/RelayChain/")}>
          <GitHub size={20} />
        </IconLink>

        <IconLink onClick={() => onClickUrl("https://www.youtube.com/channel/UC8q_XLKQtI-x5PUa4Rg3RrQ")}>
          <Youtube size={20} />
        </IconLink>

        <IconLink onClick={() => onClickUrl("https://twitter.com/relay_chain")}>
          <Twitter size={20} />
        </IconLink>

        <IconLink onClick={() => onClickUrl("https://discord.gg/TP7XHZwPkw")}>
          <LogoBlock src={getLogoByName('discord')} />
        </IconLink>
      </Container>
      <FooterTitile>
        © 2021 Polynetwork. All rights reserved.
      </FooterTitile>
    </>

  )
}
