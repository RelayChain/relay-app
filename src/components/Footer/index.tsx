import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 124px;
  background: rgba(70, 70, 70, 0.25);
  backdrop-filter: blur(28px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
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

const BrandLogo = styled.img``
export function Footer() {
  const openInNewTab = (url: string): void => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const onClickUrl = (url: string) => openInNewTab(url)

  const itemsFooter = [
    { name: 'telegram', url: 'https://t.me/relaychaincommunity' },
    { name: 'reddit', url: 'https://www.reddit.com/r/RelayChain/' },
    { name: 'github', url: 'https://github.com/RelayChain' },
    { name: 'youtube', url: 'https://www.youtube.com/channel/UC8q_XLKQtI-x5PUa4Rg3RrQ' },
    { name: 'twitter', url: 'https://twitter.com/relay_chain' },
    { name: 'discord', url: 'https://discord.gg/6suspDEh5w' }
  ]
  const fillFooter = () =>
    itemsFooter.map(item => {
      return (
        <ItemFooter key={item.url} onClick={() => onClickUrl(item.url)}>
          {item.name}
        </ItemFooter>
      )
    })

  return (
    <Container>
      <BrandLogo src={require('../../assets/images/crosschain/RELAY.png')}></BrandLogo>
      {fillFooter()}
    </Container>
  )
}
