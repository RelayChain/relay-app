import { Currency, ETHER, Token } from '@zeroexchange/sdk'
import React, { useMemo } from 'react'

import AvaxLogo from '../../assets/images/avax-logo.png'
import MaticLogo from '../../assets/images/matic-logo.png'
import BNBLogo from '../../assets/images/binance-coin-logo.webp'
// import DEVLogo from '../../assets/images/DEV-logo'
import BTCLogo from '../../assets/images/crosschain/wBTC.png'
import BUSDLogo from '../../assets/images/busd-logo.png'
import DAILogo from '../../assets/images/crosschain/wDAI.png'
import SushiLogo from '../../assets/images/sushi-logo.png'
import UNILogo from '../../assets/images/uni-logo.png'
import HTLogo from '../../assets/images/ht.png'
// import DEVLogo from '../../assets/images/dev-logo.png'
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import INDALogo from '../../assets/images/crosschain/INDA.png'
import WASLogo from '../../assets/images/crosschain/WAS.jpeg'
import GDLLogo from '../../assets/images/crosschain/GDL.png'
import BIOSLogo from '../../assets/images/crosschain/BIOS.png'
import XIOTLogo from '../../assets/images/crosschain/XIOT.png'
import Logo from '../Logo'
import USDCLogo from '../../assets/images/crosschain/wUSDC.png'
import USDTLogo from '../../assets/images/crosschain/wUSDT.png'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ZBTCLogo from '../../assets/images/crosschain/zBTC.png'
import ZDAILogo from '../../assets/images/crosschain/zDAI.png'
import ZETHLogo from '../../assets/images/crosschain/zETH.png'
import ZUSDCLogo from '../../assets/images/crosschain/zUSDC.png'
import ZUSDTLogo from '../../assets/images/crosschain/zUSDT.png'
import WISBLogo from '../../assets/images/crosschain/WISB.png'
import GROWLogo from '../../assets/images/crosschain/GROW.png'
import ZeroLogo from '../../assets/images/0-icon.png'
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
      const chosenTokenChainName = crosschainConfig.chains.find(chain => chain.tokens.find(token => token.address === currency.address))?.name
      const chainName = !chosenTokenChainName ? 'ethereum': (chosenTokenChainName === 'Smart Chain' ) ? 'binance': chosenTokenChainName.toLowerCase()
      
      const ethToken = crosschainConfig.chains[0].tokens.find(
        (token: any) => token?.assetBase === chosenToken?.assetBase
      )
      if (ethToken) {
        logoAddress = ethToken.address
      }

      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(chainName, logoAddress)]
      }

      return [getTokenLogoURL(chainName, logoAddress)]
    }
    return []
  }, [currency, uriLocations])

  if(currency?.logoURI) {
    return <StyledLogoURI src={currency?.logoURI} alt={`${currency?.symbol ?? 'token'} logo`} />
  }
  if (currency === ETHER || currency.symbol === 'ETH') {
    return <StyledEthereumLogo src={EthereumLogo} size={size} style={style} />
  }

  if (['AVAX', 'WAVAX', 'AWAX', 'zAWAX', 'wAVAX', 'AVA', 'zAVAX', 'eAVAX'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={AvaxLogo} size={size} style={style} />
  }

  if (['BNB', 'WBNB', 'wBNB', 'eBNB'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={BNBLogo} alt="BNB" size={size} style={style} />
  }

  if (['HT', 'HECO'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={HTLogo} alt="Huobi Token" size={size} style={style} />
  }
  // [ChainId.MUMBAI]: 'Mumbai'
  if (
    ['DEV', 'WDEV', 'wDEV', 'eDEV'].includes(String(currency?.symbol))
  ) {
    return <StyledEthereumLogo src="" alt="DEV" size={size} style={style} />
  }

  if (
    ['MATIC', 'WMATIC', 'wMATIC', 'eMATIC'].includes(String(currency?.symbol))
  ) {
    return <StyledEthereumLogo src={MaticLogo} alt="MATIC" size={size} style={style} />
  }

  if (['INDA'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={INDALogo} size={size} style={style} />
  }

  if (['WAS'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={WASLogo} size={size} style={style} />
  }

  if (['GDL'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={GDLLogo} size={size} style={style} />
  }

  if (['XIOT'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={XIOTLogo} size={size} style={style} />
  }

  if (['BIOS'].includes(String(currency?.symbol))) {
    return <StyledEthereumLogo src={BIOSLogo} size={size} style={style} />
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
  if (currency?.symbol === 'WISB') {
    return <StyledEthereumLogo src={WISBLogo} size={size} style={style} />
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
  if (currency?.symbol === 'zSUSHI') {
    return <StyledEthereumLogo src={SushiLogo} size={size} style={style} />
  }
  if (currency?.symbol === 'zUNI') {
    return <StyledEthereumLogo src={UNILogo} size={size} style={style} />
  }
  if (currency?.symbol === 'GROW') {
    return <StyledEthereumLogo src={GROWLogo} size={size} style={style} />
  }
  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

export const getCurrencyLogoImage = (symbol: string | undefined) => {
  switch (symbol) {
    case 'AVAX':
    case 'WAVAX':
    case 'AWAX':
    case 'zAWAX':
    case 'wAVAX':
    case 'AVA':
    case 'zAVAX':
    case 'eAVAX':
      return AvaxLogo
    case 'BNB':
    case 'WBNB':
    case 'wBNB':
    case 'eBNB':
      return BNBLogo
    case 'DEV':
    case 'WDEV':
    case 'wDEV':
    case 'eDEV':
    case 'MATIC':
    case 'WMATIC':
    case 'wMATIC':
    case 'eMATIC':
      return ''
    case 'INDA':
      return INDALogo
    case 'WAS':
      return WASLogo
    case 'GDL':
      return GDLLogo
    case 'ETH':
    case 'wETH':
      return EthereumLogo
    case 'USDT':
    case 'wUSDT':
      return USDTLogo
    case 'USDC':
    case 'wUSDC':
      return USDCLogo
    case 'BTC':
    case 'wBTC':
      return BTCLogo
    case 'DAI':
    case 'wDAI':
      return DAILogo
    case 'WISB':
      return WISBLogo
    case 'zETH':
      return ZETHLogo
    case 'zUSDT':
      return ZUSDTLogo
    case 'zUSDC':
      return ZUSDCLogo
    case 'zBTC':
      return ZBTCLogo
    case 'BUSD':
      return BUSDLogo
    case 'zDAI':
      return ZDAILogo
    case 'ZERO':
      return ZeroLogo
    case 'zSUSHI':
      return SushiLogo
    case 'zUNI':
      return UNILogo
    case 'HT':
    case 'HECO':
      return HTLogo  
    default:
      return ''
  }
}
