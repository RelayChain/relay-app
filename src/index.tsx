import 'inter-ui'
import './i18n'

import React, { StrictMode } from 'react'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'

import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import Blocklist from './components/Blocklist'
import { HashRouter } from 'react-router-dom'
import MulticallUpdater from './state/multicall/updater'
import CrosschainUpdater from './state/crosschain/updater'
import { NetworkContextName } from './constants'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import getLibrary from './utils/getLibrary'
import store from './state'
import { ToastProvider } from 'react-toast-notifications'

const tagManagerArgs = {
  gtmId: 'GTM-5WLVS3B'
}

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
TagManager.initialize(tagManagerArgs)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

console.debug = function() {
  if (!process.env.REACT_APP_TESTNET) return
  const argumentsTyped: any = arguments
  console.log.apply(this, argumentsTyped)
}

function Updaters() {
  return (
    <>
      {/*<ListsUpdater />*/}
      <CrosschainUpdater />
      <UserUpdater />
      <ApplicationUpdater />
      <TransactionUpdater />
      <MulticallUpdater />
    </>
  )
}

ReactDOM.render(
  <StrictMode>
    <FixedGlobalStyle />
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Blocklist>
        <ToastProvider autoDismiss={true}>
          <Provider store={store}>
              <Updaters />
              <ThemeProvider>
                <ThemedGlobalStyle />
                <HashRouter>
                  <App />
                </HashRouter>
              </ThemeProvider>
          </Provider>
          </ToastProvider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
