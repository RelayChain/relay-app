import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    margin-top: 10px
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 124px;
    background: rgba(70, 70, 70, 0.25);
    box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(28px);
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`
const ItemFooter = styled.div`
    color: white;
    cursor: pointer;
`

const BrandLogo = styled.img`

`
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
        { name: 'discord', url: 'https://discord.gg/sm6sbUFY' }
    ]
    const fillFooter = () =>
        itemsFooter.map(item => {
            return (
                <ItemFooter onClick={() => onClickUrl(item.url)}>{item.name}</ItemFooter>
            )
        })

    return (
        <Container>
            <BrandLogo src={require('../../assets/images/crosschain/RELAY.png')}></BrandLogo>
            {fillFooter()}
        </Container>
    )
}