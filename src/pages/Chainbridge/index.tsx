import './styles.scss';

import { CssBaseline, ToasterProvider } from '@chainsafe/common-components'
import { ErrorBoundary, init, showReportDialog } from '@sentry/react'

import { ChainbridgeProvider } from './Contexts/ChainbridgeContext'
import React from 'react'
import { ThemeSwitcher } from '@chainsafe/common-theme'
import TransferPage from './Components/Pages/TransferPage'
import { Web3Provider } from './Web3Context'
import { chainbridgeConfig } from './chainbridgeConfig'
import { lightTheme } from './Themes/LightTheme'
import { utils } from 'ethers'

if (
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE
  })
}

const ChainBridge = () => {
  const tokens = chainbridgeConfig.chains.reduce((tca, bc) => {
    return {
      ...tca,
      [bc.networkId]: bc.tokens
    }
  }, {})
  return (
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occurred and has been logged. If you would like to provide
            additional info to help us debug and resolve the issue, click the
            "Provide Additional Details" button
          </p>
          <p>{error?.message.toString()}</p>
          <p>{componentStack}</p>
          <p>{eventId}</p>
          <button onClick={() => showReportDialog({ eventId: eventId || '' })}>
            Provide Additional Details
          </button>
          <button onClick={resetError}>Reset error</button>
        </div>
      )}
      onReset={() => window.location.reload()}
    >
      <ThemeSwitcher themes={{ light: lightTheme }}>
        <CssBaseline/>
        <ToasterProvider autoDismiss>
          <Web3Provider
            tokensToWatch={tokens}
            onboardConfig={{
              walletSelect: {
                wallets: [{ walletName: 'metamask', preferred: true }]
              },
              subscriptions: {
                network: (network) => console.log('chainId: ', network),
                balance: (amount) =>
                  console.log('balance: ', utils.formatEther(amount))
              }
            }}
            checkNetwork={false}
            gasPricePollingInterval={120}
            gasPriceSetting="fast"
          >
            <ChainbridgeProvider>
              <TransferPage></TransferPage>
            </ChainbridgeProvider>
          </Web3Provider>
        </ToasterProvider>
      </ThemeSwitcher>
    </ErrorBoundary>
  )
}

export default ChainBridge
