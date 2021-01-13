import { ChevronDown, ChevronsRight, Link } from 'react-feather'

import BlockchainLogo from '../BlockchainLogo';
import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border: 1px dashed rgba(38, 98, 255, .5);
  border-radius: 14px;
  margin-bottom: 1.5rem;
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
const Row = styled.div<{ borderBottom: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: ${({ borderBottom }) => (borderBottom ? '1px dashed rgba(38, 98, 255, .5)' : 'none')};
`

const BlockchainSelector = ({
  blockchain,
  transferTo,
  supportedChains,
  isCrossChain
}: {
  blockchain?: string
  transferTo?: string;
  isCrossChain?: boolean
  supportedChains: string[]
}) => {

  const openChangeChainInfo = () => {
    alert('change chain info modal');
  }

  const openTransferModal = () => {
    alert('to do: open transfer modal');
  }

  return (
    <Container>
      { !isCrossChain &&
        <Row borderBottom={false}>
          <Link size={16} />
          <h5>
            Blockchain:
          </h5>
          <p onClick={openChangeChainInfo}>
            <BlockchainLogo size="18px" blockchain={blockchain} style={{ marginBottom: '-3px' }} />
            <span>{blockchain}</span>
            <ChevronDown size="18" style={{ marginBottom: '-3px' }} />
          </p>
        </Row>
      }
      { isCrossChain &&
        <Row borderBottom={false}>
          <p className="crosschain currentchain">
            <BlockchainLogo size="18px" blockchain={blockchain} style={{ marginBottom: '-3px' }} />
            <span>{blockchain}</span>
          </p>
          <ChevronsRight />
          <p className="crosschain" onClick={openTransferModal}>
            <BlockchainLogo size="18px" blockchain={transferTo} style={{ marginBottom: '-3px' }} />
            <span>{transferTo}</span>
            <ChevronDown size="18" style={{ marginBottom: '-3px' }} />
          </p>
        </Row>
      }
    </Container>
  )
}

export default BlockchainSelector
