import { get } from './api'

export async function getTokenBalances(account) {
  return get(`api/v2/addresses/0xab5167e8cc36a3a91fd2d75c6147140cd1837355/token-balances/latest`)
}
