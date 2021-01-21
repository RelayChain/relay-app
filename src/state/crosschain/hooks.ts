import { AppDispatch, AppState } from '../index'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useActiveWeb3React } from '../../hooks'
import useParsedQueryString from '../../hooks/useParsedQueryString'

export function useCrosschainState(): AppState['crosschain'] {
  return useSelector<AppState, AppState['crosschain']>(state => state.crosschain)
}

export function useDefaultsFromURLSearch():
  | { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined }
  | undefined {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
    >()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToCrosschainState(parsedQs)

    dispatch(
      replaceCrosschainState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId || '0xF0939011a9bb95c3B791f0cb546377Ed2693a574',
        recipient: parsed.recipient
      })
    )

    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])

  return result
}
