import { CrosschainChain, setCrosschainLastTimeSwitched, setUserBalance } from '../../state/crosschain/actions'
import React, { KeyboardEvent, RefObject, useCallback, useRef, useState } from 'react'

import { AppDispatch } from 'state'
import BlockchainLogo from '../BlockchainLogo'
import Modal from '../Modal'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { getCrosschainState } from 'state/crosschain/hooks'
import { useActiveWeb3React } from 'hooks'
import { SearchInput } from 'components/SearchModal/styleds'

interface CrossChainModalProps {
  isOpen: boolean
  onDismiss: () => void
  supportedChains: Array<CrosschainChain>
  activeChain?: string
  isTransfer?: boolean
  selectTransferChain: (str: CrosschainChain) => void
}

const StyledModal = styled(Modal)`
  position: relative;
  width: 508px;
  background: #2E2757;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.25);
`
const ModalContainer = styled.div`  
  margin-top: 150px;
  margin-left: 30px; 
  padding: 10px;
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
    max-height: 60vh;
    overflow: auto;
    li {
      display: flex;
      flex-direction: row;
      margin-bottom: 0.5rem;
      position: relative;
      padding: 12px;
      transition: all 0.2s ease-in-out; 
      align-items: center;
      width: 306px;
      height: 46px; 
      background: #130E2E;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 39px;
      &.off {
        opacity: 0.35;
        pointer-events: none;
        user-select: none;
        &:after {
          content: '(disabled)';
        }
      }
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
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-track {
      background: #cccccc;
      border-radius: 11px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d34fa0;
      border-radius: 11px;
    }
  }
`
const Cross = styled.div`
  position: absolute;
  left: 10px;
  top: 25px;
  width: 34px;
  height: 34px;
  opacity: 0.8;
  cursor: pointer;
  :hover {
    opacity: 1;
  }
  ::before,
  ::after {
    position: absolute;
    left: 15px;
    content: ' ';
    height: 20px;
    width: 4px;
    background-color: #a7b1f4;
  }
  ::before {
    transform: rotate(45deg);
  }
  ::after {
    transform: rotate(-45deg);
  }
`
const StyledInput = styled(SearchInput)`
  width: 418px;
  height: 51px; 
  background: #130E2E;
  border-radius: 50px;
  flex: none;
  order: 1;
  flex-grow: 0;
  margin: 0px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: #3E3376;
`

export default function CrossChainModal({
  isOpen,
  onDismiss,
  supportedChains,
  activeChain,
  isTransfer,
  selectTransferChain
}: CrossChainModalProps) {
  const dispatch = useDispatch<AppDispatch>()

  const [isMetamaskError, setMetamaskError] = useState(false)
  const [filteredChains, setFilteredChains] = useState(supportedChains)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { account } = useActiveWeb3React()
  const switchChain = async (chain: CrosschainChain) => {
    let { ethereum } = window
    const { allCrosschainData } = getCrosschainState()
    if (ethereum) {
      let chainsConfig = null
      for (const item of allCrosschainData.chains) {
        if (item.chainId === +chain.chainID) {
          chainsConfig = item
        }
      }
      if (chainsConfig) {
        const hexChainId = '0x' + Number(chainsConfig.networkId).toString(16)
        const data =
          chain.chainID === '1'
            ? [{ chainId: '0x1' }, account]
            : [
              {
                chainId: hexChainId,
                chainName: chainsConfig.name,
                nativeCurrency: {
                  name: chainsConfig.nativeTokenSymbol,
                  symbol: chainsConfig.nativeTokenSymbol,
                  decimals: 18
                },
                rpcUrls: [chainsConfig.rpcUrl],
                blockExplorerUrls: [chainsConfig.blockExplorer]
              }
            ]
        /* eslint-disable */
        const ethMethod = chain.chainID === '1' ? 'wallet_switchEthereumChain' : 'wallet_addEthereumChain'
        const tx = ethereum && ethereum.request ? ethereum['request']({ method: ethMethod, params: data }).catch() : ''

        if (tx !== '') {
          tx.then(t => {
            dispatch(setCrosschainLastTimeSwitched({}))
            dispatch(setUserBalance({ balance: '0' }))
            setTimeout(() => {
              window.location.reload()
            }, 100)
          })
        } else {
          setMetamaskError(true)
        }
      }
    }
  }

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredChains.length > 0) {
          const res = filteredChains.filter(x => (x.name.toLowerCase()).includes(searchQuery.toLowerCase()))
          setFilteredChains(res)
        }
      }
    },
    [searchQuery]
  )

  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const inputRef = useRef<HTMLInputElement>()

  return (
    <StyledModal isOpen={isOpen} onDismiss={onDismiss} maxHeight={100} isChainSwitch={true} >
      <Cross onClick={onDismiss} />
      <ModalContainer>
        {!isTransfer && <h5>Change Blockchains:</h5>}
        {isTransfer && <h5>Select Network</h5>}
        <StyledInput
          type="text"
          id="chain-search-input"
          placeholder={'Search name'}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <ul>
          <li className={!isTransfer ? 'active' : 'disabled'}>
            <BlockchainLogo size="28px" blockchain={activeChain} />
            <span>{activeChain}</span>
          </li>
          {filteredChains
            .filter(x => x.name.toLowerCase() !== activeChain?.toLowerCase())
            .map((chain: CrosschainChain) => (
              <li
                key={chain.chainID}
                onClick={() => {
                  if (isTransfer) {
                    selectTransferChain(chain)
                    onDismiss()
                  } else if (isMetamaskError) {
                    alert('The wallet is not responding now. Please try to change your RPC inside your wallet.')
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
    </ StyledModal>
  )
}
