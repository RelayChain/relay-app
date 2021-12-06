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

import { ExternalLink } from '../../theme'
import Modal from '../Modal'
import React from 'react'
import styled from 'styled-components'

interface ModalMoreProps {
  isOpen: boolean
  onDismiss: () => void
}

const ModalContainer = styled.div`
  position: relative;
  padding: 3.5rem;
  width: 100%;
  z-index: 10;
  border-radius: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const MenuItem = styled(ExternalLink)`
  color: ${({ theme }) => theme.text2};
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  font-size: 13px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  border-bottom: 0;
  :hover {
    color: white;
    text-decoration: none;
  }
  :focus {
    color: ${({ theme }) => theme.text2};
    text-decoration: none;
  }
  &::after {
    content: '';
    position: absolute;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.1);
    width: 100%;
    top: 35px;
    left: 0;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 12px;
`};
`
const IconLink = styled.span`
  display: inline-block;
  margin-right: 20px;
  text-decoration: none;
`
const Cross = styled.div`
  position: absolute;
  right: 35px;
  top: 25px;
  width: 34px;
  height: 34px;
  opacity: 0.8;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
  ::before,
  ::after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 25px;
    width: 1px;
    background-color: #a7b1f4;
  }
  ::before {
    transform: rotate(45deg);
  }
  ::after {
    transform: rotate(-45deg);
  }
`
const LogoBlock = styled.img`
  height: 20px;
  width: 20px;
`

function getLogoByName(tokenName: string) {
  return require(`../../assets/images/${tokenName}.svg`)
}

export default function ModalMore({ isOpen, onDismiss }: ModalMoreProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        <Cross onClick={onDismiss} />

        <MenuItem id="link" href="https://relaychain.com">
          <IconLink>
            <Info size={20} />
          </IconLink>
          Home
        </MenuItem>

        <MenuItem href={`https://docs.relaychain.com`}>
          <IconLink>
            <Book size={20} />
          </IconLink>
          Docs
        </MenuItem>
        <MenuItem href={`https://www.relaychain.com/whitepaper`}>
          <IconLink>
            <Paperclip size={20} />
          </IconLink>
          Whitepaper
        </MenuItem>

        <MenuItem id="link" href="https://medium.com/@Relay_Chain">
          <IconLink>
            <BookOpen size={20} />
          </IconLink>
          Blog
        </MenuItem>

        <MenuItem id="link" href="https://t.me/relaychaincommunity">
          <IconLink>
          <LogoBlock src={getLogoByName('telegram')} />
          </IconLink>
          Telegram
        </MenuItem>

        <MenuItem id="link" href="https://discord.gg/TP7XHZwPkw">
          <IconLink>
          <LogoBlock src={getLogoByName('discord')} />
          </IconLink>
          Discord
        </MenuItem>

        <MenuItem id="link" href="https://twitter.com/relay_chain">
          <IconLink>
            <Twitter size={20} />
          </IconLink>
          Twitter
        </MenuItem>

        <MenuItem id="link" href="https://www.youtube.com/channel/UC8q_XLKQtI-x5PUa4Rg3RrQ">
          <IconLink>
            <Youtube size={20} />
          </IconLink>
          Youtube
        </MenuItem>

        <MenuItem id="link" href="https://www.reddit.com/r/RelayChain/">
          <IconLink>
          <LogoBlock src={getLogoByName('reddit')} />
          </IconLink>
          Reddit
        </MenuItem>

        <MenuItem id="link" href="https://coinmarketcap.com/currencies/relay-token/">
          <IconLink>
            <BarChart size={20} />
          </IconLink>
          Coinmarketcap
        </MenuItem>
        <MenuItem id="link" href="https://www.coingecko.com/en/coins/relay-token/">
          <IconLink>
            <BarChart2 size={20} />
          </IconLink>
          CoinGecko
        </MenuItem>
        <MenuItem id="link" href="https://github.com/RelayChain/">
          <IconLink>
            <GitHub size={20} />
          </IconLink>
          Github
        </MenuItem>
      </ModalContainer>
    </Modal>
  )
}
