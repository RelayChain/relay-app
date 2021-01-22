import { ChevronDown, ChevronsRight, Link } from 'react-feather'

import BlockchainLogo from '../BlockchainLogo';
import { CrosschainChain } from '../../state/crosschain/actions'
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px dashed rgba(38, 98, 255, .5);
  border-radius: 14px;
  margin-bottom: 1.5rem;
  margin-top: .5rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  h5 {
    margin-left: .3rem;
  }
  p {
    margin-left: auto;
    padding: .5rem .25rem;
    border-radius: 12px;
    background: rgba(38, 98, 255, .25);
    transition: all .2s ease-in-out;
    font-size: .85rem;
    span {
      margin-left: 4px;
      margin-right: 4px;
    }
    &:hover {
      background: rgba(38, 98, 255, .75);
      cursor: pointer;
    }
    &.crosschain {
      margin: auto;
    }
    &.currentchain {
      background: transparent;
    }
  }
`
const Row = styled.div<{ borderBottom: boolean, isCrossChain?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ isCrossChain }) => (!isCrossChain ? '0 1rem 0 1rem' : '1rem')};
  border-bottom: ${({ borderBottom }) => (borderBottom ? '1px dashed rgba(38, 98, 255, .5)' : 'none')};
`

const BlockchainSelector = ({
  blockchain,
  transferTo,
  supportedChains,
  isCrossChain,
  onShowCrossChainModal,
  onShowTransferChainModal
}: {
  blockchain: string | CrosschainChain | undefined
  transferTo: string | CrosschainChain;
  isCrossChain?: boolean
  supportedChains: string[]
  onShowCrossChainModal: () => void
  onShowTransferChainModal: () => void
}) => {

  const openChangeChainInfo = () => {
    onShowCrossChainModal();
  }

  const openTransferModal = () => {
    onShowTransferChainModal();
  }

  console.log("blockchain", blockchain)
  console.log("transferTo", transferTo)

  if (!blockchain) {
    return <div />
  }

  // @ts-ignore
  return (
    <Container>
      { !isCrossChain &&
        <Row borderBottom={false} isCrossChain={isCrossChain}>
          <Link size={16} />
          <h5>
            Blockchain:
          </h5>
          <p onClick={openChangeChainInfo}>
            <BlockchainLogo size="18px" blockchain={typeof(blockchain) === "string"? blockchain : ""} style={{ marginBottom: '-3px' }} />
            <span>{blockchain}</span>
            <ChevronDown size="18" style={{ marginBottom: '-3px' }} />
          </p>
        </Row>
      }
      { isCrossChain &&
        <Row borderBottom={false} isCrossChain={isCrossChain}>
          <p className="crosschain currentchain">
            <BlockchainLogo size="18px" blockchain={typeof(blockchain) !== "string"? blockchain.name : ""} style={{ marginBottom: '-3px' }} />
            <span>{typeof(blockchain) !== "string"? blockchain.name : ""}</span>
          </p>
          <ChevronsRight />
          <p className="crosschain" onClick={openTransferModal}>
            <BlockchainLogo size="18px" blockchain={typeof(transferTo) !== "string"? transferTo.name : ""} style={{ marginBottom: '-3px' }} />
            <span>{typeof(transferTo) !== "string"? transferTo.name : ""}</span>
            <ChevronDown size="18" style={{ marginBottom: '-3px' }} />
          </p>
        </Row>
      }
    </Container>
  )
}

export default BlockchainSelector
