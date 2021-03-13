import { AVAX, BNB, Currency, ETHER, Token } from '@zeroexchange/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ETH'
  if (currency === AVAX) return 'AVAX'
  if (currency === BNB) return 'BNB'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
