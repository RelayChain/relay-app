import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, Trade } from '@zeroexchange/sdk'
import { copyToClipboard, wait } from '../../utils'
import styled, { ThemeContext } from 'styled-components'

import AvaxLogo from '../../assets/images/avax-logo.png'
import BigNumber from 'bignumber.js'
import BinanceLogo from '../../assets/images/binance-logo.png'
import BubbleBase from '../BubbleBase';
import CurrencyLogo from '../CurrencyLogo';
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import Icon from '../Icon';
import React from 'react'

const BalanceCard = styled.div`
  margin-bottom: 20px;
  position: relative;
  height: 118px;
  width: 100%;
  background: rgba(47, 53, 115, 0.32);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.095);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 34px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
`
const Box = styled.div`
  margin-left: 24px;
`

const CrossChain = styled.div`
  font-weight: 600;
  font-size: 1.5rem;
  span {
    margin-left: 10px;
    color: #929ad6;
    opacity: 0.8;
    font-size: 1rem;
  }
`
const AddressWallet = styled.div`
  font-size: 17px;
  color: #b97cd6;
  opacity: 0.88;
`
const BoxFlex = styled.div`
  display: flex;
  align-items: center;
`
const CopyImage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const StyledEthereumLogo = styled.img`
  width: 48px;
  height: 48px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
`

export default function BalanceItem({
  chainId,
  token,
  isNative,
  currentChain,
  userEthBalance,
}: {
  chainId?: any,
  token?: any,
  isNative?: boolean,
  currentChain?: any,
  userEthBalance?: any,
}) {

  const weiToEthNum = (balance: any, decimals = 18) => {
    const displayBalance = balance.dividedBy(new BigNumber(10).pow(decimals))
    return displayBalance.toNumber()
  }

  const returnChainLogo = () => {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.RINKEBY:
      case ChainId.KOVAN:
        return EthereumLogo;
      case ChainId.AVALANCHE:
      case ChainId.FUJI:
        return AvaxLogo;
      case ChainId.SMART_CHAIN:
      case ChainId.SMART_CHAIN_TEST:
        return BinanceLogo;
      default:
        return EthereumLogo;
    }
  }

  const onClickCopyClipboard = async (e: any) => {
    e.stopPropagation()
    copyToClipboard(token.address)
    await wait(1)
  }

  return (
    <BalanceCard>
      <BubbleBase />
      <BoxFlex>
        {
          isNative ? <StyledEthereumLogo src={returnChainLogo()} /> :
                     <CurrencyLogo size="48px" currency={token} />
        }
        <Box>
          <CrossChain>
            {isNative ? currentChain?.symbol : token?.symbol}
            <span>{isNative ? currentChain?.name : token?.name}</span>
          </CrossChain>
          {
            isNative ? <AddressWallet>{userEthBalance?.toSignificant(4)}</AddressWallet> :
            <AddressWallet>{weiToEthNum(new BigNumber(token?.amount), token?.decimals)}</AddressWallet>
          }
        </Box>
      </BoxFlex>
      {
        !isNative &&
        <CopyImage onClick={onClickCopyClipboard}>
          <span style={{ marginRight: '6px', color: '#A7B1F4' }}>address</span>
          <Icon icon="copyClipboard" />
        </CopyImage>
      }
    </BalanceCard>
  )
}
