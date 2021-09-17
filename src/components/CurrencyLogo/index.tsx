import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import React, { useMemo } from 'react'

import Logo from '../Logo'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { crosschainConfig as crosschainConfigTestnet } from '../../constants/CrosschainConfigTestnet'
import { crosschainConfig as crosschainConfigMainnet } from '../../constants/CrosschainConfig'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'

const crosschainConfig = process.env.REACT_APP_TESTNET ? crosschainConfigTestnet : crosschainConfigMainnet

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
  'AVAX': ['AVAX', 'WAVAX', 'AWAX', 'zAWAX', 'wAVAX', 'AVA', 'zAVAX', 'eAVAX'],
  'ETH': ['ETH', 'pngETH', 'zETH'],
  'WETH': ['WETH', 'wETH'],
  'HT': ['HT', 'HECO', 'WHT'],
  'BNB': ['BNB', 'WBNB', 'wBNB', 'eBNB'],
  'GROW': ['GROW'],
  'WISB': ['WISB'],
  // 'INDA': ['INDA'],
  'MATIC': ['MATIC', 'WMATIC', 'wMATIC', 'eMATIC', 'DEV', 'WDEV', 'wDEV', 'eDEV'],
  'XIOT': ['XIOT'],
  'CHART': ['CHART', 'ChartEx'],
  'z1INCH': ['z1INCH', '1INCH'],
  //'AAVE': ['zAAVE', 'AAVE'],
  'ZERO': ['ZERO'],
  'LINK': ['LINK', 'zLINK'],
  'UNI': ['zUNI', 'UNI'],
  'SUSHI': ['zSUSHI', 'SUSHI'],
  'wUSDT': ['USDT', 'wUSDT'],
  'zUSDT': ['zUSDT'],
  'wUSDC': ['USDC', 'wUSDC'],
  'zUSDC': ['zUSDC'],
  'zBTC': ['zBTC'],
  'wBTC': ['wBTC', 'WBTC', 'BTC'],
  'zDAI': ['zDAI'],
  'wDAI': ['wDAI', 'DAI', 'pngDAI'],
  'RELAY': ['RELAY'],
  'BUSD': ['BUSD'],
  // 'WAS': ['WAS'],
  'GDL': ['GDL'],
  'BIOS': ['BIOS'],
  // 'YFI': ['YFI', 'zYFI'],
  'PERA': ['PERA'],
  'MAI': ['MAI', 'MAI (miMatic)'],
  'CNR': ['CNR', 'Canary']
}

function getLogoByName(tokenName: string) {
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
  const getTokenLogoURL = (chain: string, address: string) => {
    return `https://raw.githubusercontent.com/zeroexchange/bridge-tokens/main/${chain}-tokens/${address}/logo.png`
  }
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const logoName = getCurrencyLogoImage(String(currency?.symbol))
  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency && currency.symbol === 'ZERO') return []
    if (logoName === '') {
      if (currency instanceof Token) {
        // find logos on ETH address for non-ETH assets
        let logoAddress = currency.address
        const allConfigTokens: any = []
        // eslint-disable-next-line 
        crosschainConfig.chains.map(chain => {
          // eslint-disable-next-line 
          chain.tokens.map(token => {
            allConfigTokens.push(token)
          })
        })
        const chosenTokenChainName = crosschainConfig.chains.find(chain => chain.tokens.find(token => token.address === currency.address))?.name
        const chainName = !chosenTokenChainName ? 'ethereum' : (chosenTokenChainName === 'Smart Chain') ? 'binance' : chosenTokenChainName.toLowerCase()

        if (currency instanceof WrappedTokenInfo) {
          return [...uriLocations, getTokenLogoURL(chainName, logoAddress)]
        }

        return [getTokenLogoURL(chainName, logoAddress)]
      }
    }

    return []
  }, [logoName, currency, uriLocations])

  if (currency?.logoURI) {
    return <StyledLogoURI src={currency?.logoURI} alt={`${currency?.symbol ?? 'token'} logo`} />
  }

  if (logoName !== '') {
    return <StyledEthereumLogo src={getLogoByName(logoName)} size={size} style={style} />
  } else {
    return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }
}
