import React, { useState } from 'react'
import BubbleBase from 'components/BubbleBase'
import PageContainer from 'components/PageContainer'
import styled from 'styled-components'
import ProgressBar from './components/ProgressBar'
import { Text } from 'rebass'
import { LinkStyledButton, TYPE } from '../../theme'
import Toggle from './components/Toggle'
import { useActiveWeb3React } from 'hooks'
import UnlockWallet from '../../assets/svg/lottery_unlock_wallet.svg'
import LotteryTicket from '../../assets/svg/lottery_ticket.svg'
import { ButtonOutlined, ButtonPrimary } from 'components/Button'

const Title = styled.h1`
  width: 100%;
  padding: 0px 64px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 0;
  text-align: center;
  font-size: 49px;
  margin-top: 40px;
  margin-bottom: 0px;
`};
`
const LotteryFlex = styled.div<{ flexStart?: boolean }>`
  margin: 20px auto 0;
  display: flex;
  justify-content: center;
  align-items:stretch
  ${({ flexStart }) =>
    flexStart &&
    `
  align-items:flex-start
  `}
  gap: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  align-items: stretch
`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: center;
`};
`

const LotteryWrap = styled.div`
  width: 100%;
  position: relative;
  max-width: 465px;
  padding: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center
    ${({ theme }) => theme.mediaWidth.upToSmall`

`};
`

const LotteryProgressBar = styled(ProgressBar)`
  margin: auto;
`

const ReadMoreButton = styled(LinkStyledButton)`
  font-weight: 600;
  font-size: 17px;
  margin: 1rem auto 0 auto;
  display: block;
`

const Table = styled.table`
  width: 100%;
  margin: 2rem 0rem;
  border-spacing: 0px;
  background-color: #171c47;
  border-radius: 44px;
  tr {
    td {
      padding: 1rem 2rem;
    }
    &:nth-child(2n) {
      background-color: #13173c;
    }
  }
`

const NoAccount = styled.img`
  width: 117px;
  height: 112px;
`
const EmptyData = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`
const Message = styled.div`
  padding: 32px;
`

const WrapButton = styled.div`
  width: 70%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
`

export const Lottery = () => {
  const [isSelected, setSelected] = useState<boolean>(true)
  const { account } = useActiveWeb3React()

  const showNextDraw = () => {
    return (
      <LotteryFlex flexStart={true}>
        <LotteryWrap>
          <BubbleBase />
          <TYPE.main fontSize={14} fontWeight={600}>
            Total Pot
          </TYPE.main>
          <TYPE.white fontWeight={700} fontSize={[33, 36, 48]} style={{ marginTop: '1rem' }}>
            0
          </TYPE.white>
          <Table>
            <tbody>
              <tr>
                <td>
                  <TYPE.main fontWeight={600} fontSize={[10, 13, 13]} style={{ textAlign: 'left' }}>
                    No Matched
                  </TYPE.main>
                </td>
                <td>
                  <TYPE.main fontWeight={600} fontSize={[10, 13, 13]} style={{ textAlign: 'right' }}>
                    Prize Pot
                  </TYPE.main>
                </td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>4</td>
                <td style={{ textAlign: 'right' }}>455</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>5</td>
                <td style={{ textAlign: 'right' }}>53443</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>6</td>
                <td style={{ textAlign: 'right' }}>6221</td>
              </tr>
              <tr>
                <td>
                  <TYPE.main fontWeight={600} fontSize={[10, 13, 13]} style={{ textAlign: 'left' }}>
                    to burn:
                  </TYPE.main>
                </td>
                <td>
                  <TYPE.main fontWeight={600} fontSize={[14, 16, 18]} style={{ textAlign: 'right' }}>
                    4343
                  </TYPE.main>
                </td>
              </tr>
            </tbody>
          </Table>
        </LotteryWrap>
        {account === null && (
          <LotteryWrap>
            <BubbleBase />
            <EmptyData>
              <NoAccount src={UnlockWallet} />
              <Message>
                <TYPE.main>Unlock wallet to access lottery</TYPE.main>
              </Message>
              <WrapButton>
                <ButtonPrimary>Unlock Wallet</ButtonPrimary>
              </WrapButton>
            </EmptyData>
          </LotteryWrap>
        )}
        {account !== null && (
          <LotteryWrap style={{ padding: '0' }}>
            <div style={{ position: 'relative', padding: '2rem' }}>
              <BubbleBase />
              <TYPE.main fontSize={14} fontWeight={600}>
                Until Ticket Sale
              </TYPE.main>
              <TYPE.white fontWeight={700} fontSize={[33, 36, 48]} style={{ marginTop: '1rem' }}>
                1h 15m
              </TYPE.white>
              <WrapButton style={{ margin: '1rem auto' }}>
                <ButtonOutlined disabled={true}>On Sale Soon</ButtonOutlined>
              </WrapButton>
            </div>
            <div style={{ position: 'relative', padding: '2rem', marginTop: '1rem' }}>
              <BubbleBase />
              <NoAccount src={LotteryTicket} />
              <TYPE.main fontSize={14} fontWeight={600}>
                Sorry, no prize to collect
              </TYPE.main>
              <ReadMoreButton>View Your Tickets</ReadMoreButton>
            </div>
          </LotteryWrap>
        )}
      </LotteryFlex>
    )
  }
  const showPastDraw = () => {
    return <></>
  }

  return (
    <>
      <Title>Lottery</Title>
      <PageContainer>
        <LotteryFlex>
          <LotteryWrap>
            <BubbleBase />
            <TYPE.white fontWeight={600} fontSize={[10, 13, 13]}>
              Ticket sale
            </TYPE.white>
            <TYPE.white fontWeight={700} fontSize={[27, 30, 40]} style={{ marginTop: '1rem' }}>
              1h 15m
            </TYPE.white>
            <LotteryProgressBar value={0}></LotteryProgressBar>
          </LotteryWrap>

          <LotteryWrap>
            <BubbleBase />
            <TYPE.white fontWeight={700} fontSize={[22, 24, 32]}>
              How it works
            </TYPE.white>
            <TYPE.main fontSize={14} style={{ marginTop: '1rem' }}>
              Spend Zero to buy tiickets, contributing to the lottery pot. WIn prizes if 2, 3, or 4 of your ticket
              numbers match the winning numbers and their exact order
            </TYPE.main>
            <ReadMoreButton>Read More</ReadMoreButton>
          </LotteryWrap>
        </LotteryFlex>
        <LotteryFlex>
          <Toggle isActive={isSelected} toggle={() => setSelected(!isSelected)} text1="Next Draw" text2="Past Draw" />
        </LotteryFlex>
        {isSelected ? showNextDraw() : showPastDraw()}
      </PageContainer>
    </>
  )
}

export default Lottery
