import { Book, BookOpen, DollarSign, Info, MessageCircle } from 'react-feather'

import { ExternalLink } from '../../theme'
import Icon from '../Icon'
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
  margin-bottom: 1.5rem;
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
export default function ModalMore({ isOpen, onDismiss }: ModalMoreProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        <Cross onClick={onDismiss} />
        <MenuItem href={`https://buy.0.exchange`}>
          <IconLink>
            <DollarSign size={20} />
          </IconLink>
          Buy ZERO
        </MenuItem>

        <MenuItem href={`https://zero-exchange.gitbook.io/zero-exchange-docs/`}>
          <IconLink>
            <Book size={20} />
          </IconLink>
          Guides
        </MenuItem>

        <MenuItem id="link" href="https://0.exchange">
          <IconLink>
            <Info size={20} />
          </IconLink>
          Home
        </MenuItem>

        <MenuItem id="link" href="https://blog.0.exchange">
          <IconLink>
            <BookOpen size={20} />
          </IconLink>
          Blog
        </MenuItem>

        <MenuItem id="link" href="https://web.telegram.org/#/im?p=@ZeroExchangeCommunity">
          <IconLink>
            <MessageCircle size={20} />
          </IconLink>
          Telegram
        </MenuItem>

        <MenuItem id="link" href="https://discord.gg/XtZTNVTX5T">
          <IconLink>
            <MessageCircle size={20} />
          </IconLink>
          Discord
        </MenuItem>

        <MenuItem id="link" href="https://www.coingecko.com/en/coins/zero-exchange">
          <IconLink>
            <img style={{ float: 'left', width: '20px', height: '20px' }} src="/images/coingecko.png" />
          </IconLink>
          CoinGecko
        </MenuItem>
      </ModalContainer>
    </Modal>
  )
}
