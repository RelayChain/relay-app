import { AppDispatch, AppState } from '../index'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import { setCurrentTokenBalance } from './actions'

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(setCurrentTokenBalance({balance:'3543'}))
  }, [dispatch, chainId])

  return undefined
}
