import { get, getTyped } from './api'

import { CGPrice } from 'hooks/useCoinGeckoPrice'

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



const RELAY_API_URL
  = window.location.hostname === 'development-branch.relaychain.com' ? 'https://relay-dev-api-zcgj3.ondigitalocean.app'
    : window.location.hostname === 'localhost' ? 'https://relay-dev-api-zcgj3.ondigitalocean.app'
      // : window.location.hostname === 'localhost' ? 'http://localhost:8080'
      : 'https://relay-api-33e56.ondigitalocean.app';

export async function getCurrentStats() {
  const url = `${RELAY_API_URL}/api/stats`
  return get(url)
}

export async function getCurrentTvl() {
  const url = `${RELAY_API_URL}/api/currentTvl`
  return get(url)
}

export async function getFundsOnHandler(chainId: string, resourceId: string, amount: string) {
  const url = `${RELAY_API_URL}/api/enoughFundsOnHandler?resourceId=${resourceId}&chainId=${chainId}&amount=${amount}`
  return get(url)
}

export async function getBalanceOnHandler(chainId: string, resourceId: string) {
  const url = `${RELAY_API_URL}/api/balanceOnHandler?resourceId=${resourceId}&chainId=${chainId}`
  return get(url)
}

export async function getCrossChainData<T>() {
  return getTyped<T>(`${RELAY_API_URL}/api/crosschain-config`)
}

export async function getTvlData<T>() {
  return getTyped<T>(`${RELAY_API_URL}/tvl/currentTvl`)
}

export async function getGasPrices() {
  return getTyped<{ [k: number]: string }>(`${RELAY_API_URL}/api/gasPrices`);
}

export async function getCoinGeckoPrice(symbol: string) {
  return getTyped<CGPrice>(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=USD`);
}
