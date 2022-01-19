import { ChevronDown, Link } from 'react-feather'

import { ArrowDown } from '../Arrows'
import { ArrowRight } from '../Arrows'
import BlockchainLogo from '../BlockchainLogo'
import { CrosschainChain } from '../../state/crosschain/actions'
import React from 'react'
import { ReactComponent as SmallDropDown } from '../../assets/images/small-dropdown-white-select.svg'
import styled from 'styled-components'

const Container = styled.div`
  h5 {
    margin-left: 0.3rem;
  }
  p {
    display: flex;
    margin-bottom: 5px;
    align-items: center;
    border-radius: 12px;
    background: rgba(103, 82, 247, 0.25);
    transition: all 0.2s ease-in-out;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-bottom: 20px;
  `};
    span {
      font-size: 14px;
      margin-left: 13px;
    }
    &:hover {
      background: rgba(103, 82, 247, 0.75);
      cursor: pointer;
    }
    &.crosschain {
      position: relative;
      width: 170px;
      height: 35px; 
      background: #211A4A;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
      border-radius: 58px;
      font-family: Montserrat;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
      color: #ffffff;
      ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 229px;
    `};
      ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 186px;
    max-width: 100%;
  `};
    }
    &.currentchain {
      background: transparent;
      ${({ theme }) => theme.mediaWidth.upToSmall`
      display: flex;
      justify-content: center;
    `};
    }
  }
`
const Row = styled.div<{ borderBottom: boolean; isCrossChain?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ isCrossChain }) => (!isCrossChain ? '0 1rem 0 1rem' : '0rem')};
  border-bottom: ${({ borderBottom }) => (borderBottom ? '1px dashed rgba(103, 82, 247, .5)' : 'none')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`
const SmallStyledDropDown = styled(SmallDropDown)`
  margin: 0 0.25rem 0 0.5rem;
  margin-left: auto;
  width: 12px;
  height: 8px;
`

const CrossChainWrap = styled.div`
  position: relative;
  width: 252px;
  min-height: 146px;
  background: rgba(18, 21, 56, 0.24);
  box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(28px);
  border-radius: 44px;
  padding-left: 30px;
  padding-top: 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  padding-left: 0px;
  margin-bottom: 20px;
`};
`
const SubTitle = styled.h3`
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.05em;
  color: #a7b1f4;
  opacity: 0.56;
  margin-bottom: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
 text-align: center;
`};
`

const ShowSmall = styled.div`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: block;
  margin-bottom: 20px;
`};
`
const HideSmall = styled.div`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToSmall`
display: none;
`};
`
const FlexOrder = styled.div`
  ${({ theme }) => theme.mediaWidth.upToSmall`
display: flex;
flex-direction: column-reverse;
align-items: center;

`};
`
const TextBlockSelect = styled.span`
  margin-left: 5px;
  font-size: 1rem;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 17px;
  line-height: 21px;
`
const StyledSelect = styled.div`
  padding: 7px;
  width: 170px;
  height: 35px;   
  background: #211A4A;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  transferTo: any // tslint not working here, same as above
  isCrossChain?: boolean
  supportedChains: string[]
  onShowCrossChainModal: () => void
  onShowTransferChainModal: () => void
}) => {
  const openChangeChainInfo = () => {
    onShowCrossChainModal()
  }

  const openTransferModal = () => {
    onShowTransferChainModal()
  }

  if (!blockchain) {
    return <div />
  }

  // @ts-ignore
  return (
    <Container>
      {!isCrossChain && (
        <Row borderBottom={false} isCrossChain={isCrossChain}>
          <Link size={16} />
          <h5>Blockchain:</h5>
          <p onClick={openChangeChainInfo}>
            <BlockchainLogo
              size="18px"
              blockchain={typeof blockchain === 'string' ? blockchain : ''}
              style={{ marginBottom: '-3px' }}
            />
            <span>{blockchain}</span>
            <ChevronDown size="24" style={{ marginBottom: '-3px' }} />
          </p>
        </Row>
      )}
      {isCrossChain && (
        <Row borderBottom={false} isCrossChain={isCrossChain}>

          <StyledSelect onClick={openTransferModal}>
            {transferTo && transferTo.name.length > 0 && (
              <BlockchainLogo
                size="25px"
                blockchain={typeof transferTo !== 'string' ? transferTo.name : ''}
                style={{ marginRight: '0px' }}
              />
            )}
            <TextBlockSelect>
              {transferTo && transferTo.name.length > 0 ? transferTo.name : 'Select a chain'}
            </TextBlockSelect>
            <SmallStyledDropDown />
          </StyledSelect>

        </Row>
      )}
    </Container>
  )
}

export default BlockchainSelector
