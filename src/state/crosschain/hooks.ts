import { AppDispatch, AppState } from '../index'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import {
  CrosschainChain,
  ProposalStatus,
  setAvailableChains,
  setAvailableTokens,
  setCrosschainFee,
  setCrosschainRecipient,
  setCrosschainSwapStatus,
  setCurrentChain,
  setCurrentToken,
  setCurrentTokenBalance,
  setCurrentTxID, setTargetChain,
  setTransferAmount
} from './actions'

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setCurrentTokenBalance({ balance: '3543' }))
  }, [dispatch, chainId])

  return undefined
}

export function useMockCrossChain(): any | undefined {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {

    dispatch(setCrosschainSwapStatus({ txID: '0xdfgdfgdfgdfgjkdfgjdfjgkdfgkdfg', status: ProposalStatus.ACTIVE }))
    dispatch(setCrosschainRecipient({ address: '0xE323c3087c75Fb7EeBf41d20190dc9886b45F303' }))
    dispatch(setCurrentTxID({ txID: '0xE323c3087c75Fb7EeBf41d20190dc9886b45F303' }))
    dispatch(setAvailableChains({
      chains: [
        {
          name: 'Ethereum',
          chainID: '5'
        },
        {
          name: 'Avalanche',
          chainID: '4'
        },
        {
          name: 'Polkadot',
          chainID: '45'
        }
      ]
    }))

    dispatch(setAvailableTokens({
      tokens: [
        {
          name: 'GHJ',
          address: '0xE323c3089999999999999999999999999b45F303'
        },
        {
          name: 'fghfgh',
          address: '0xE323c3089999999999955555555555599b45F303'
        },
        {
          name: 'ghjghjgh',
          address: '0xE32399999999444444444444444999999b45F303'
        }
      ]
    }))
    dispatch(setTargetChain({
      chain: {
        name: 'Ethereum',
        chainID: '45'
      }
    }))
    dispatch(setCurrentChain({
      chain: {
        name: 'Avalanche',
        chainID: '5'
      }
    }))
    dispatch(setCurrentToken({
      token: {
        name: 'GHJ',
        address: '0xE323c3089999999999999999999999999b45F303'
      }
    }))
    dispatch(setCurrentTokenBalance({ balance: '3543' }))
    dispatch(setTransferAmount({ amount: '3455' }))
    dispatch(setCrosschainFee({ value: '456547' }))
  }, [])
  return undefined
}