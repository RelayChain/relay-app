import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import React, { useMemo } from 'react'

import AvaxLogo from '../../assets/images/avax-logo.png'
import BNBLogo from '../../assets/images/binance-coin-logo.webp'
import BTCLogo from '../../assets/images/crosschain/wBTC.png'
import BUSDLogo from '../../assets/images/busd-logo.png'
import DAILogo from '../../assets/images/crosschain/wDAI.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Logo from '../Logo'
import USDCLogo from '../../assets/images/crosschain/wUSDC.png'
import USDTLogo from '../../assets/images/crosschain/wUSDT.png'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ZBTCLogo from '../../assets/images/crosschain/zBTC.png'
import ZDAILogo from '../../assets/images/crosschain/zDAI.png'
import ZETHLogo from '../../assets/images/crosschain/zETH.png'
import ZUSDCLogo from '../../assets/images/crosschain/zUSDC.png'
import ZUSDTLogo from '../../assets/images/crosschain/zUSDT.png'
import ZeroLogo from '../../assets/images/0-icon.png'
import { crosschainConfig as crosschainConfigTestnet } from '../../constants/CrosschainConfigTestnet'
import { crosschainConfig as crosschainConfigMainnet } from '../../constants/CrosschainConfig'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'

const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

const crosschainConfig = process.env.REACT_APP_TESTNET ? crosschainConfigTestnet : crosschainConfigMainnet

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)
  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []
    if (currency && currency.symbol === 'ZERO') return []
    if (currency instanceof Token) {
      // find logos on ETH address for non-ETH assets
      let logoAddress = currency.address
      const allConfigTokens: any = []
      crosschainConfig.chains.map(chain => {
        chain.tokens.map(token => {
          allConfigTokens.push(token)
        })
      })
      const chosenToken = allConfigTokens.find((token: any) => token.address === currency.address)
      const ethToken = crosschainConfig.chains[0].tokens.find(
        (token: any) => token?.assetBase === chosenToken?.assetBase
      )
      if (ethToken) {
        logoAddress = ethToken.address
      }

      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(logoAddress)]
      }

      return [getTokenLogoURL(logoAddress)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  if (
    currency?.symbol === 'AVAX' ||
    currency?.symbol === 'WAVAX' ||
    currency?.symbol === 'AWAX' ||
    currency?.symbol === 'zAWAX' ||
    currency?.symbol === 'wAVAX' ||
    currency?.symbol === 'AVA' ||
    currency?.symbol === 'zAVAX' ||
    currency?.symbol === 'eAVAX'
  ) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  if (
    currency?.symbol === 'BNB' ||
    currency?.symbol === 'WBNB' ||
    currency?.symbol === 'wBNB' ||
    currency?.symbol === 'eBNB'
  ) {
    return <StyledEthereumLogo src={BNBLogo} alt="BNB" size={size} style={style} />
  }

  // cross chain
  if (currency?.symbol === 'ETH' || currency?.symbol === 'wETH') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'USDT' || currency?.symbol === 'wUSDT') {
    return <StyledEthereumLogo src={USDTLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'USDC' || currency?.symbol === 'wUSDC') {
    return <StyledEthereumLogo src={USDCLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'BTC' || currency?.symbol === 'wBTC') {
    return <StyledEthereumLogo src={BTCLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'DAI' || currency?.symbol === 'wDAI') {
    return <StyledEthereumLogo src={DAILogo} size={size} style={style} />
  }

  if (currency?.symbol === 'zETH') {
    return <StyledEthereumLogo src={ZETHLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'zUSDT') {
    return <StyledEthereumLogo src={ZUSDTLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'zUSDC') {
    return <StyledEthereumLogo src={ZUSDCLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'zBTC') {
    return <StyledEthereumLogo src={ZBTCLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'BUSD') {
    return <StyledEthereumLogo src={BUSDLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'zDAI') {
    return <StyledEthereumLogo src={ZDAILogo} size={size} style={style} />
  }

  if (currency && currency.symbol === 'ZERO') {
    return <StyledEthereumLogo src={ZeroLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
