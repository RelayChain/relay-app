import { AVAX, BNB, ChainId, Currency, CurrencyAmount, ETHER, Token, TokenAmount, WETH } from '@zeroexchange/sdk'

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === ETHER
    ? WETH[chainId]
    : (chainId && currency === AVAX) || (chainId && currency === BNB)
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
  if (token.equals(WETH[token.chainId]) && chainId === ChainId.MAINNET) return ETHER
  if (token.equals(WETH[token.chainId]) && chainId === ChainId.AVALANCHE) return AVAX
  if (token.equals(WETH[token.chainId]) && chainId === ChainId.SMART_CHAIN) return BNB
  return token
}
