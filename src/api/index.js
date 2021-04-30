import { get } from './api'

const ZERO_API_URL = process.env.REACT_APP_ZERO_API_URL
const ZERO_API_KEY = process.env.REACT_APP_ZERO_API_KEY

export async function getTokenBalances(account) {
  return get(`https://web3api.io/api/v2/addresses/${account}/token-balances/latest`)
}

export async function getRelayerBalances() {
  return get(`${ZERO_API_URL}/relayers/QueryRelayerBalances?apikey=${ZERO_API_KEY}`)
}

export async function getTVLData() {
  return get(`${ZERO_API_URL}/TVL/GetTVLdata`)
}

export async function getAllPoolsAPY() {
  return get(`${ZERO_API_URL}/APY/GetAllPoolsAPY`)
}

export async function getSinglePoolAPY(address) {
  return get(`${ZERO_API_URL}/APY/GetPoolAPY?contractAddr=${address}`)
}

export async function getWalletHolderCount() {
  return get(`${ZERO_API_URL}/walletholders/getCount`)
}

export async function getTVLHistory() {
  return get(`${ZERO_API_URL}/TVL/GetHistory`)
}
