import BlockchainLogo from '../BlockchainLogo'
import { CrosschainChain } from '../../state/crosschain/actions'
import Modal from '../Modal'
import React from 'react'
import { crosschainConfig } from 'constants/CrosschainConfig'
import styled from 'styled-components'
import { useActiveWeb3React } from 'hooks'
interface CrossChainModalProps {
  isOpen: boolean
  onDismiss: () => void
  supportedChains: Array<CrosschainChain>
  activeChain?: string
  isTransfer?: boolean
  selectTransferChain: (str: CrosschainChain) => void
}

const ModalContainer = styled.div`
  padding: 1.5rem;
  width: 100%;
  h5 {
    font-weight: bold;
    margin-bottom: 1rem;
  }
  p {
    font-size: 0.85rem;
    margin-top: 1rem;
    line-height: 20px;
    color: #ced0d9;
    a {
      font-weight: bold;
      color: ${({ theme }) => theme.primary1};
      cursor: pointer;
      outline: none;
      text-decoration: none;
      margin-left: 4px;
      margin-right: 4px;
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-left: 0;
    padding-right: 0;
    li {
      display: flex;
      flex-direction: row;
      margin-bottom: .5rem;
      position: relative;
      padding: 12px;
      transition: all 0.2s ease-in-out;
      border-radius: 12px;
      align-items: center;
      &.active {
        background: rgba(255, 255, 255, 0.1);
        &:before {
          position: absolute;
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 100%;
          background: ${({ theme }) => theme.primary1};
          top: 8px;
          right: 8px;
        }
      }
      &:not(.active):hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.1);
      }
      &.disabled {
        opacity: 0.35;
        pointer-events: none;
        user-select: none;
      }
      &.selectable {
        cursor: pointer;
        &:hover {
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
        }
      }
      img {
        margin-right: 0.5rem;
      }
      span {
      }

    }
  }
`
export default function CrossChainModal({
  isOpen,
  onDismiss,
  supportedChains,
  activeChain,
  isTransfer,
  selectTransferChain
}: CrossChainModalProps) {
  const switchChain = async (chain: CrosschainChain) => {
    let { ethereum } = window;
   
    if (ethereum) {
      let chainsConfig = null
      for (const item of crosschainConfig.chains) {
        if (item.chainId === +chain.chainID) {
          chainsConfig = item
        }
      }
      if (chainsConfig) {
        const hexChainId = "0x" + Number(chainsConfig.networkId).toString(16);
        const data = [{
          chainId: hexChainId,
          chainName: chainsConfig.name,
          nativeCurrency:
          {
            name: chainsConfig.nativeTokenSymbol,
            symbol: chainsConfig.nativeTokenSymbol,
            decimals: 18
          },
          rpcUrls: [chainsConfig.rpcUrl],
          blockExplorerUrls: [chainsConfig.blockExplorer],
        }]
        /* eslint-disable */
        const tx = (ethereum && ethereum.request) ? ethereum['request']({ method: 'wallet_addEthereumChain', params: data }).catch() : ''

        if (tx) {
          console.log(tx)
        }
      }
    }
  }
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContainer>
        {!isTransfer && <h5>Change Blockchains:</h5>}
        {isTransfer && <h5>Transfer tokens to:</h5>}
        <ul>
          <li className={!isTransfer ? 'active' : 'disabled'}>
            <BlockchainLogo size="28px" blockchain={activeChain} />
            <span>{activeChain}</span>
          </li>
          {supportedChains.map((chain: CrosschainChain) => (
            <li
              key={chain.chainID}
              onClick={() => {
                if (isTransfer) {
                  selectTransferChain(chain)
                  onDismiss()
                } else if (+chain.chainID === 1) {
                  alert('To switch back to Ethereum, please change your RPC inside your wallet.');
                  onDismiss()
                } else {
                  switchChain(chain)
                  onDismiss()
                }
              }}
              className={`
              ${activeChain === chain.name && !isTransfer ? 'active' : ''}
              ${(activeChain === chain.name && isTransfer) || chain.name === 'Polkadot' ? 'disabled' : ''}
              ${isTransfer && activeChain !== chain.name ? 'selectable' : ''}
            `}
            >
              <BlockchainLogo size="28px" blockchain={chain.name} />
              <span>{chain.name}</span>
            </li>
          ))}
        </ul>

      </ModalContainer>
    </Modal>
  )
}
