import './snow.css'

import { OpenClaimAddressModalAndRedirectToSwap, RedirectPathToSwapOnly, RedirectPathToHomeOnly, RedirectToSwap } from './Swap/redirects'
import React, { Suspense, useState } from 'react'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity
} from './AddLiquidity/redirects'
import { Route, Switch } from 'react-router-dom'
import { useModalOpen, useToggleModal } from '../state/application/hooks'

import AddLiquidity from './AddLiquidity'
import AddressClaimModal from '../components/claim/AddressClaimModal'
import { ApplicationModal } from '../state/application/actions'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'
import Earn from './Earn'
import Guides from './Guides'
import SideMenu from '../components/SideMenu'
import MenuBurger from '../components/MenuBurger'
import Header from '../components/Header'
import Manage from './Earn/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import Mountains from '../components/Mountains'
import Polling from '../components/Header/Polling'
// import Pool from './Pool'
import PoolFinder from './PoolFinder'
import Popups from '../components/Popups'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import RemoveLiquidity from './RemoveLiquidity'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import Swap from './Swap'
import Bridge from './Bridge'
import Home from './Home'
import URLWarning from '../components/Header/URLWarning'
import Vote from './Vote'
import VotePage from './Vote/VotePage'
import Web3ReactManager from '../components/Web3ReactManager'
import styled from 'styled-components'
import { useDarkModeManager } from '../state/user/hooks'
import LogoDark from './../assets/images/0-icon.png'
import Logo from './../assets/svg/logo.svg'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
  overflow-y: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 2rem;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const Title = styled.a`
  position: fixed;
  top: 54px;
  left: 54px;
  width: 76px;
  height: 76px;
  z-index: 1000;
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 46px;
  height: 46px;
  top: 34px;
  left: 22px;
  `};
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export default function App() {
  const [open, setOpen] = useState<boolean>(false)
  const [isDark] = useDarkModeManager()
  return (
    <Suspense fallback={null}>
      <Route component={DarkModeQueryParamReader} />
      <Title href=".">
        <img width={'100%'} src={isDark ? LogoDark : Logo} alt="logo" />
      </Title>
      <MenuBurger open={open} setOpen={() => setOpen(!open)} />
      <SideMenu open={open} setOpen={() => setOpen(!open)} />
      <AppWrapper>
        <div className="snow-bg"></div>
        <div className="bg-darken"></div>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <BodyWrapper>
          <Popups />
          <Polling />
          <TopLevelModals />
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/home" component={Home} />
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              {/*<Route exact strict path="/pool" component={Pool} />*/}
              <Route exact strict path="/earn" component={Earn} />
              <Route exact strict path="/guides" component={Guides} />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              <Route exact strict path="/migrate/v1" component={MigrateV1} />
              <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />
              <Route exact strict path="/zero/:currencyIdA/:currencyIdB" component={Manage} />
              <Route exact strict path="/vote/:id" component={VotePage} />
              <Route exact strict path="/bridge" component={Bridge}/>
              <Route component={RedirectPathToHomeOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  )
}
