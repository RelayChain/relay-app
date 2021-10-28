import { get, getTyped } from './api'

const ZERO_API_URL = process.env.REACT_APP_ZERO_API_URL
const ZERO_API_KEY = process.env.REACT_APP_ZERO_API_KEY

export async function getTokenBalances(account: string) {
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

export async function getSinglePoolAPY(address: string) {
  return get(`${ZERO_API_URL}/APY/GetPoolAPY?contractAddr=${address}`)
}

export async function getWalletHolderCount() {
  return get(`${ZERO_API_URL}/walletholders/getCount`)
}

export async function getTVLHistory() {
  return get(`${ZERO_API_URL}/TVL/GetHistory`)
}

export async function getCrossChainData<T>() {
  return getTyped<T>('https://relay-api-33e56.ondigitalocean.app/api/crosschain-config')
}

export async function getTvlData<T>() {
  return getTyped<T>('https://relay-api-33e56.ondigitalocean.app/tvl/currentTvl')
}