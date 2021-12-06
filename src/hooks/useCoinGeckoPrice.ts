import { getCoinGeckoPrice } from 'api';

export type CGPrice = {
[key: string]: {
    usd: number
}
}
export async function useCoinGeckoPrice(symbol: string): Promise<CGPrice> {
  return await getCoinGeckoPrice(symbol);
}
