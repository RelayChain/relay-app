import React from 'react'
import styled from 'styled-components'

import Modal from '../Modal'
import { CloseIcon } from '../../theme'
import OutsideLink from '../../assets/images/outside-link.svg'
import { StakingModalProps } from './index'

const ModalHeader = styled.header`
  padding: 12px 24px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Title = styled.h2`
  color: #a7b1f4;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 14px;
`};
`

const Description = styled.p`
  color: #a7b1f4;
  font-size: 11px;
  padding: 12px 24px;
  width: 100%;
`
const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  margin-left: 5px;
  img {
    max-width: 100%;
  }
`

const TakeZeroText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    text-decoration: none;
    outline: none;
  }
`
const TableContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
  padding: 2px 24px;
`

const TableTitle = styled.h3`
  color: white;
  font-weight: 600;
  line-height: 1.5;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-size: 12px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 10px;
`};
`

const TableSubTitle = styled.h4`
  color: #a7b1f4;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 11px;
`};
`

const StakingRoiModal = ({ open, setOpen }: StakingModalProps) => {
  const closeModal = () => setOpen(false)
  return (
    <Modal isOpen={open} onDismiss={closeModal}>
      <div>
        <ModalHeader>
          <Title>ROI</Title>
          <CloseIcon onClick={closeModal} />
        </ModalHeader>
        <TableContent>
          <div>
            <TableTitle>Timeframe</TableTitle>
          </div>
          <div>
            <TableTitle>ROI</TableTitle>
          </div>
          <div>
            <TableTitle>RFOX per $1000</TableTitle>
          </div>
          <div>
            <TableSubTitle>1d</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>0.50%</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>31.12</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>7d</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>3.56%</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>221.13</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>30d</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>16.17%</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>1004.65</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>365d(APY)</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>519.55%</TableSubTitle>
          </div>
          <div>
            <TableSubTitle>32275.76</TableSubTitle>
          </div>
        </TableContent>
        <Description>
          Calculated based on current rates. Compounding 1x daily. Rates are estimates provided for your convenience
          only, and by no means represent guaranteed returns.
        </Description>
        <TakeZeroText>
          <a href="#">Get ZERO</a>
          <IconWrapper>
            <img src={OutsideLink} alt="MetaMask icon" />
          </IconWrapper>
        </TakeZeroText>
      </div>
    </Modal>
  )
}

export default StakingRoiModal
