import { AVAX, BNB, DEV, MATIC, Currency, ETHER, Token } from '@zeroexchange/sdk'

export function currencyId(currency: Currency): string {
  if (currency === ETHER) return 'ETH'
  if (currency === AVAX) return 'AVAX'
  if (currency === BNB) return 'BNB'
  if (currency === DEV) return 'DEV'
  if (currency === MATIC) return 'MATIC'
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
