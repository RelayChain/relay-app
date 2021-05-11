import { ChainId } from '@zeroexchange/sdk'
import { unwrappedToken } from './wrappedCurrency'

export const searchItems = (items: any[], searchText: string, chainId?: ChainId) => {
  if (searchText.length == 0 || searchText === '' || searchText.trim().length === 0) {
    return items
  }
  return items.map(item => {
    const firstCurrencySymbol = unwrappedToken(item.tokens[0], chainId)
    const secondCurrencySymbol = unwrappedToken(item.tokens[1], chainId)

    if (firstCurrencySymbol.symbol && secondCurrencySymbol.symbol) {
      if (
        firstCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1 ||
        secondCurrencySymbol.symbol.toLowerCase().indexOf(searchText.toLowerCase().trim()) > -1
      ) {
        return item
      }
    } else {
      return { ...item, isHidden: true }
    }
  })
}
