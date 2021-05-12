import { useSelector } from 'react-redux'
import { AppState } from '../index'

export function usePoolsState(): AppState['pools'] {
  return useSelector<AppState, AppState['pools']>(state => state.pools)
}