import { get } from './api'

export async function getTokenBalances(account) {
  return get(`api/v2/addresses/${account}/latest`)
}
