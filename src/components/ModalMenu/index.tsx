import { Book, BookOpen, Info, Twitter, GitHub, Youtube, BarChart, BarChart2, Paperclip } from 'react-feather'

import Icon from '../Icon'
import Modal from '../Modal'
import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink, useHistory, useLocation } from 'react-router-dom'

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
  flex-wrap: wrap;
`
const MenuItem = styled(NavLink)`
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

const StyledNavLink = styled(NavLink)`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */
  color: #ffffff;
`

function getLogoByName(tokenName: string) {
  return require(`../../assets/images/${tokenName}.svg`)
}

export default function ModalMenu({ isOpen, onDismiss }: ModalMoreProps) {
  const [open, setOpen] = useState<boolean>(false)
  const location = useLocation()
  const [pathname, setPathname] = useState(location.pathname)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const redirectTo = (path: string) => {
    setPathname(path)
    onDismiss()
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        <Cross onClick={onDismiss} />

        <MenuItem
          id={`bridge-nav-link`}
          to={'/bridge'}
          onClick={() => redirectTo('/bridge')}
        >
          <IconLink>
            <Icon icon="bridges" active={pathname === '/bridge'} />
          </IconLink>
          Bridge
        </MenuItem>

        <MenuItem
          id={`stake-nav-link`}
          to={'/single-sided-staking'}
          onClick={() => redirectTo('/single-sided-staking')}
        >
          <IconLink>
            <Icon icon="planet" active={pathname.includes('single-sided-staking')} />
          </IconLink>
          Staking
        </MenuItem>
        <MenuItem id={`pools`} to={'/pools'} onClick={() => redirectTo('/pools')}>
          <IconLink>
            <Icon icon="earn" active={pathname === '/pools'} />
          </IconLink>
          Polls
        </MenuItem>
      </ModalContainer>
    </Modal>
  )
}
