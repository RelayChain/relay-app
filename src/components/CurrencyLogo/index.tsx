import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import React, { useMemo } from 'react'

import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import styled from 'styled-components'
import { useCrosschainState } from 'state/crosschain/hooks'
import useHttpLocations from '../../hooks/useHttpLocations'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo) <{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`
const StyledLogoURI = styled.img`
  border-radius: 50%;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  width: 24px;
  height: 24px;
`
const logosNames = {
  //name logoName of a file in assets/images/crosschain folder   => names
  'AVAX': ['AVAX', 'WAVAX', 'AWAX', 'zAWAX', 'wAVAX', 'AVA', 'zAVAX', 'eAVAX', 'Avalanche', 'Avalanche AVAX'],
  'ETH': ['ETH', 'pngETH', 'zETH', 'Ethereum', 'Ethereum ETH'],
  'WETH': ['WETH', 'wETH', 'WETH.e'],
  'HT': ['HT', 'HECO', 'WHT', 'HECO'],
  'BNB': ['BNB', 'WBNB', 'wBNB', 'eBNB', 'Smart Chain', 'SmartChain'],
  'GROW': ['GROW'],
  'WISB': ['WISB'],
  // 'INDA': ['INDA'],
  'MATIC': ['MATIC', 'WMATIC', 'wMATIC', 'eMATIC', 'DEV', 'WDEV', 'wDEV', 'eDEV', 'Polygon', 'POLYGON'],
  'XIOT': ['XIOT'],
  'CHART': ['CHART', 'ChartEx'],
  'z1INCH': ['z1INCH', '1INCH'],
  //'AAVE': ['zAAVE', 'AAVE'],
  'ZERO': ['ZERO'],
  'LINK': ['LINK', 'zLINK'],
  'UNI': ['zUNI', 'UNI'],
  'SUSHI': ['zSUSHI', 'SUSHI'],
  'wUSDT': ['USDT', 'wUSDT', 'USDT.e'],
  'zUSDT': ['zUSDT'],
  'wUSDC': ['USDC', 'wUSDC', 'USDC.e'],
  'zUSDC': ['zUSDC'],
  'zBTC': ['zBTC'],
  'wBTC': ['wBTC', 'WBTC', 'BTC'],
  'zDAI': ['zDAI'],
  'wDAI': ['wDAI', 'DAI', 'pngDAI', 'DAI.e'],
  'RELAY': ['RELAY'],
  'BUSD': ['BUSD'],
  // 'WAS': ['WAS'],
  'GDL': ['GDL'],
  'BIOS': ['BIOS'],
  // 'YFI': ['YFI', 'zYFI'],
  'PERA': ['PERA'],
  'MAI': ['MAI', 'MAI (miMatic)'],
  'CNR': ['CNR', 'Canary'],
  'MOVR': ['MOVR', 'Moonriver', 'MOONRIVER'],
  'FTM': ['FTM', 'Fantom', 'FANTOM'],
  'SDN': ['SDN', 'Shiden', 'SHIDEN'],
  'IOTX': ['IOTX', 'IOTEX', 'IoTeX', 'Iotex'],
  'ONE': ['ONE', 'HARMONY', 'Harmony'],
  'CRO': ['CRO', 'CRONOS', 'Cronos'],
  'OKT': ['OKT', 'OKEx', 'OKEX'],
  'MTV': ['MTV', 'MULTIVAC', 'MultiVAC'],
  'METIS': ['METIS', 'METIS_NETWORK', 'MetisNetwork', 'Metis Network', 'Metis'],
  'GLMR': ['GLMR', 'MOONBEAM', 'Moonbeam']
}

export function getLogoByName(tokenName: string) {
  return require(`../../assets/images/crosschain/${tokenName}.png`)
}
export const getCurrencyLogoImage = (symbol: string | undefined) => {
  if (!symbol) return ''
  let logoName = ''
  for (const [key, names] of Object.entries(logosNames)) {
    if (names.includes(symbol)) {
      logoName = key
    }
  }
  return logoName
}
export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency | any
  size?: string
  style?: React.CSSProperties
}) {
  const { allCrosschainData } = useCrosschainState()
  const getTokenLogoURL = (chain: string, address: string) => {
    return `https://raw.githubusercontent.com/RelayChain/bridge-tokens/main/${chain}-tokens/${address}/logo.png`
  }
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const logoName = getCurrencyLogoImage(String(currency?.symbol))


  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency && currency.symbol === 'ZERO') return []
    if (logoName === '') {
      if (currency instanceof Token && allCrosschainData && allCrosschainData.chains.length > 0) {
        // find logos on ETH address for non-ETH assets
        let logoAddress = currency.address
        const allConfigTokens: any = []
        // eslint-disable-next-line
        allCrosschainData?.chains?.map(chain => {
          // eslint-disable-next-line
          chain.tokens.map(token => {
            allConfigTokens.push(token)
          })
        })
        const chosenTokenChainName = allCrosschainData?.chains?.find(chain => chain.tokens.find(token => token.address.toLowerCase() === currency.address.toLowerCase()))?.name
        const chainName = !chosenTokenChainName ? 'ethereum' : (chosenTokenChainName === 'Smart Chain') ? 'binance' : (chosenTokenChainName === 'Metis Network') ? 'metis' : chosenTokenChainName.toLowerCase()

        if (currency instanceof WrappedTokenInfo) {
          return [...uriLocations, getTokenLogoURL(chainName, logoAddress)]
        }

        return [getTokenLogoURL(chainName, logoAddress)]

      }
    }

    return []
  }, [logoName, currency, uriLocations, allCrosschainData.chains])

  if (currency?.logoURI) {
    return <StyledLogoURI src={currency?.logoURI} alt={`${currency?.symbol ?? 'token'} logo`} />
  }

  if (logoName !== '') {
    return <StyledEthereumLogo src={getLogoByName(logoName)} size={size} style={style} />
  } else {
    return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }
}
