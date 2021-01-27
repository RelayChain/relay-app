import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import React, { useMemo } from 'react'

import BTCLogo from '../../assets/images/crosschain/wBTC.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Logo from '../Logo'
import USDCLogo from '../../assets/images/crosschain/wUSDC.png'
import USDTLogo from '../../assets/images/crosschain/wUSDT.png'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ZBTCLogo from '../../assets/images/crosschain/zBTC.png'
import ZETHLogo from '../../assets/images/crosschain/zETH.png'
import ZUSDCLogo from '../../assets/images/crosschain/zUSDC.png'
import ZUSDTLogo from '../../assets/images/crosschain/zUSDT.png'
import ZeroLogo from '../../assets/images/logo-zero-124.png'
import styled from 'styled-components'
import useHttpLocations from '../../hooks/useHttpLocations'

const getTokenLogoURL = (address: string) => {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
}

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
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  // cross chain
  if (currency.symbol === 'ETH') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }
  if (currency.symbol === 'USDT') {
    return <StyledEthereumLogo src={USDTLogo} size={size} style={style} />
  }
  if (currency.symbol === 'USDC') {
    return <StyledEthereumLogo src={USDCLogo} size={size} style={style} />
  }
  if (currency.symbol === 'BTC' || currency.symbol === 'wBTC') {
    return <StyledEthereumLogo src={BTCLogo} size={size} style={style} />
  }

  if (currency.symbol === 'zETH') {
    return <StyledEthereumLogo src={ZETHLogo} size={size} style={style} />
  }
  if (currency.symbol === 'zUSDT') {
    return <StyledEthereumLogo src={ZUSDTLogo} size={size} style={style} />
  }
  if (currency.symbol === 'zUSDC') {
    return <StyledEthereumLogo src={ZUSDCLogo} size={size} style={style} />
  }
  if (currency.symbol === 'zBTC') {
    return <StyledEthereumLogo src={ZBTCLogo} size={size} style={style} />
  }

  if (currency && currency.symbol === 'ZERO') {
    return <StyledEthereumLogo src={ZeroLogo} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}
