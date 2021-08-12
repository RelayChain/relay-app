import { useEffect, useState } from 'react'

import { ChainId, CurrencyAmount, JSBI } from '@zeroexchange/sdk'
import { NetworkContextName } from '../constants'
import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { injected } from '../connectors'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & { chainId?: ChainId } {
  const context = useWeb3ReactCore<Web3Provider>()
  const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
  return context.active ? context : contextNetwork
}

export function useEagerConnect() {
  const { library, account, chainId, active, activate } = useWeb3ReactCore()
  const dispatch = useDispatch<AppDispatch>()

  const [tried, setTried] = useState(false)
  const [currencyAmount, setCurrencyAmount] = useState('')

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(injected, undefined, true)
          .then(async () => {
            const ethBalance = await onSignIn({ account, chainId })
            if (ethBalance) {
              setCurrencyAmount(ethBalance)
            }
          })
          .catch(() => {
            setTried(true)
          })
      } else {
        setTried(true)
      }
    })
  }, [activate, dispatch, library, account, chainId]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return [tried, currencyAmount]
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore() // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(error => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      // const handleNetworkChanged = (network: any) => {
      //   // eat errors
      //   activate(injected, undefined, true).catch(error => {
      //     console.error('Failed to activate after networkChanged changed', error)
      //   })
      // }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(error => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      // ethereum.on('networkChanged', handleNetworkChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          // ethereum.removeListener('networkChanged', handleNetworkChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate])
}


const onSignIn = async ({ account, chainId }: any) => {  
  const { ethereum } = window as any
  if (!account || !chainId || !ethereum) return
  const balance = await ethereum.request({ method: 'eth_getBalance', params: [account] })
  return CurrencyAmount.ether(JSBI.BigInt(balance.toString()), chainId).toSignificant(6)

}
