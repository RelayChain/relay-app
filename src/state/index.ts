import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { load, save } from 'redux-localstorage-simple'

import application from './application/reducer'
import burn from './burn/reducer'
import crosschain from './crosschain/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import pools from './pools/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'crosschain']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    pools,
    mint,
    burn,
    multicall,
    lists,
    crosschain
  },
  middleware: [...getDefaultMiddleware({ thunk: false, immutableCheck: false, serializableCheck: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
