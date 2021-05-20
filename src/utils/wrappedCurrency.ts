import { AVAX, BNB, DEV, MATIC, ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH, ETHER_CURRENCIES } from '@zeroexchange/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency && ETHER_CURRENCIES.includes(currency)
    ? WETH[chainId]
    : currency instanceof Token
    ? currency
    : undefined
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined
}

export function unwrappedToken(token: Token, chainId?: ChainId): Currency {
  if (token.equals(WETH[token.chainId]) && (chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY)) return ETHER
  if ((token.equals(WETH[token.chainId]) && chainId === ChainId.AVALANCHE) || chainId === ChainId.FUJI) return AVAX
  if ((token.equals(WETH[token.chainId]) && chainId === ChainId.SMART_CHAIN) || chainId === ChainId.SMART_CHAIN_TEST)
    return BNB
  if (token.equals(WETH[token.chainId]) && chainId === ChainId.MOONBASE_ALPHA) return DEV
  if (token.equals(WETH[token.chainId]) && (chainId === ChainId.MUMBAI || chainId === ChainId.MATIC)) return MATIC
  return token
}
