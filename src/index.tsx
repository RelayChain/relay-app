import 'inter-ui'
import './i18n'

import React, { StrictMode } from 'react'
import ThemeProvider, { FixedGlobalStyle, ThemedGlobalStyle } from './theme'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'

import App from './pages/App'
import ApplicationUpdater from './state/application/updater'
import Blocklist from './components/Blocklist'
import { HashRouter } from 'react-router-dom'
import ListsUpdater from './state/lists/updater'
import MulticallUpdater from './state/multicall/updater'
import { NetworkContextName } from './constants'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import TransactionUpdater from './state/transactions/updater'
import UserUpdater from './state/user/updater'
import getLibrary from './utils/getLibrary'
import store from './state'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if ('ethereum' in window) {
  ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

function Updaters() {
  return (
    <>
      {/*<ListsUpdater />*/}
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
          <Provider store={store}>
            <Updaters />
            <ThemeProvider>
              <ThemedGlobalStyle />
              <HashRouter>
                <App />
              </HashRouter>
            </ThemeProvider>
          </Provider>
        </Blocklist>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
