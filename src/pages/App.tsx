import './snow.css'

import {
  OpenClaimAddressModalAndRedirectToSwap,
  RedirectPathToSwapOnly,
  RedirectPathToTransferOnly,
  RedirectToSwap
} from './Swap/redirects'
import React, { Suspense } from 'react'
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
import { Footer } from 'components/Footer'
import GraphQLProvider from './../graphql'
import Guides from './Guides'
import Header from '../components/Header'
import Manage from './Pools/Manage'
import MigrateV1 from './MigrateV1'
import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
import Polling from '../components/Header/Polling'
// import Pool from './Pool'
import PoolFinder from './PoolFinder'
import Pools from './Pools'
import Popups from '../components/Popups'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import RemoveLiquidity from './RemoveLiquidity'
import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'
import SideMenu from '../components/SideMenu'
import { SingleSidedStaking } from './SingleSidedStaking'
import Transfer from './Transfer'
import URLWarning from '../components/Header/URLWarning'
import Web3ReactManager from '../components/Web3ReactManager'
import styled from 'styled-components'
import Stats from './Stats'
import Bridge from './Bridge'

const AppWrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  width: 100%;
  height: auto;
  min-height: calc(100vh - 124px);
`

function TopLevelModals() {
  const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
  const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return <AddressClaimModal isOpen={open} onDismiss={toggle} />
}

export default function App() {
  return (
    <Suspense fallback={null}>
      <GraphQLProvider>
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper>
          {/* <SideMenu /> */}
          <div className="ellipse-bg"></div>

          <BodyWrapper>
            <URLWarning />
            <HeaderWrapper>
              <Header />
            </HeaderWrapper>
            <Popups />
            <Polling />
            <TopLevelModals />
            <Web3ReactManager>
              <Switch>
                {/* <Route exact strict path="/home" component={Home} />*/}
                {/* <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} />*/}
                {/* <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />*/}
                {/* <Route exact strict path="/send" component={RedirectPathToSwapOnly} />*/}
                {/* <Route exact strict path="/find" component={PoolFinder} />*/}
                {/* <Route exact strict path="/staking" component={Staking} /> */}
                <Route exact strict path="/single-sided-staking" component={SingleSidedStaking} />
                <Route exact strict path="/pools" component={Pools} />
                <Route exact strict path="/guides" component={Guides} />
                <Route exact strict path="/stats" component={Stats} />
                {/* <Route exact strict path="/create" component={RedirectToAddLiquidity} />*/}
                {/* <Route exact path="/add" component={AddLiquidity} />*/}
                {/* <Route exact path="/add/:currencyIdA" component={AddLiquidity} />*/}
                {/* <Route exact path="/add/:currencyIdA/:currencyIdB" component={AddLiquidity} />*/}
                {/* <Route exact path="/create" component={AddLiquidity} />*/}
                {/* <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />*/}
                {/* <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />*/}
                {/* <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} />*/}
                {/* <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />*/}
                {/* <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />*/}
                {/* <Route exact strict path="/remove" component={RemoveLiquidity} />*/}
                {/* <Route exact strict path="/migrate/v1" component={MigrateV1} />*/}
                {/* <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} />*/}
                {/* <Route exact strict path="/manage/:currencyIdA/:currencyIdB" component={Manage} />*/}
                <Route exact strict path="/cross-chain-bridge-transfer" component={Transfer} />
                <Route exact strict path="/bridge" component={Bridge} />
                <Route component={Transfer} />
              </Switch>
            </Web3ReactManager>
          </BodyWrapper>
          <Footer />
        </AppWrapper>
      </GraphQLProvider>
    </Suspense>
  )
}
