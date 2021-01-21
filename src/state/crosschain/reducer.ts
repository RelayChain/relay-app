import { Field, replaceCrosschainState, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

import { createReducer } from '@reduxjs/toolkit'

export interface CrosschainState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  // the typed recipient address or ENS name, or null if crosschain should go to sender
  readonly recipient: string | null
}

const initialState: CrosschainState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT]: {
    currencyId: ''
  },
  recipient: null
}

export default createReducer<CrosschainState>(initialState, builder =>
  builder
    .addCase(
      replaceCrosschainState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId
          },
          independentField: field,
          typedValue: typedValue,
          recipient
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const currentState = { ...initialState, ...state };
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT;
      if (currencyId === currentState[otherField].currencyId) {
        // the case where we have to crosschain the order
        return {
          ...currentState,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...currentState,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId },
        recipient: state.recipient || null,
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        [Field.INPUT]: { currencyId: state[Field.INPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        typedValue,
        recipient: state.recipient || null,
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
