import {ETHER_CURRENCIES, Currency, Token } from '@zeroexchange/sdk'

export function currencyId(currency: Currency): string {
  if(ETHER_CURRENCIES.includes(currency)) return String(currency.symbol)
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
