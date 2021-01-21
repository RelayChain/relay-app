import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('crosschain/selectCurrency')
export const switchCurrencies = createAction<void>('crosschain/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('crosschain/typeInput')
export const replaceCrosschainState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('crosschain/replaceCrosschainState')
export const setRecipient = createAction<{ recipient: string | null }>('crosschain/setRecipient')
