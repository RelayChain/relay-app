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
import SearchBar from '../../components/SearchBar'
import BubbleChart from './../../components/BubbleChart'

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
  margin: 2rem auto 0rem;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 1rem;
  ${({ flexStart }) => flexStart && `align-items:flex-start`}

  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
  align-items: center;
`};
`

const LotteryWrap = styled.div<{ pastDraw?: boolean }>`
  width: 100%;
  position: relative;
  ${({ pastDraw }) => (pastDraw ? `max-width: 534px;` : ` max-width: 465px; text-align: center;`)}
  padding: 2rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 1.5rem;
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
  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size: 14px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  font-size: 12px;
`};
`

const Table = styled.table`
  width: 100%;
  margin-top: 1rem;
  border-spacing: 0px;
  background-color: #171c47;
  border-radius: 44px;
  color: #a7b1f4;
  font-size: 14px;
  tr {
    td {
      padding: 1rem 2rem;
      text-align: center;
      &:last-child {
        text-align: right;
      }
      &:first-child {
        text-align: left;
      }
    }
    &:nth-child(even) {
      background-color: #13173c;
    }
    &:hover {
      color: #ffffff;
      font-size: 14px;
    }
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  border-radius: 20px;
  tr {
    td {
      padding: 1rem 1rem;
    }
  }
  `};
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

const WrapButton = styled.div<{ percentageString?: string }>`
  width: ${({ percentageString }) => percentageString};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
`

const BodyWrapper = styled.div`
  width: 100%;
  margin-top: 1rem;
  max-width: 954px;
  position: relative;
  padding: 3rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center
    ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 465px;
`};
`
const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`
const FlexRowButton = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding-top: 1rem
  gap:1rem
    ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: center;
  text-align:center;
  flex-direction: column-reverse;
`};
`
const TicketMatching = styled.div`
  width: 100%;
  max-width: 482px;
  padding: 2rem;
  margin: 1rem auto 0rem auto;
  background-color: #171c47;
  border-radius: 44px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 1rem;
  border-radius: 20px;
`};
`

const TicketMatchingRow = styled.table`
  border-spacing: 0px;
  margin: 0 auto;
`
const SearchGroup = styled.div`
  width: 100%;
  max-width: 505px;
  margin: 2rem auto 0;
`
const HighChartWrap = styled.div`
  width: 100%;
  position: relative;
  max-width: 534px;
`
export const Lottery = () => {
  const [isSelected, setSelected] = useState<boolean>(true)
  const { account } = useActiveWeb3React()
  const [searchText, setSearchText] = useState('')

  const showNextDraw = () => {
    return (
      <>
        <LotteryFlex flexStart={account === null ? true : false}>
          <LotteryWrap>
            <BubbleBase />
            <TYPE.main fontSize={14} fontWeight={600}>
              Total Pot
            </TYPE.main>
            <TYPE.white fontWeight={700} fontSize={[33, 36, 48]} style={{ margin: '1rem 0' }}>
              0
            </TYPE.white>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      No Matched
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      Prize Pot
                    </TYPE.main>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>455</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>53443</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>6221</td>
                </tr>
                <tr>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      to burn:
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[14, 16, 18]}>
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
                <WrapButton percentageString={'70%'}>
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
                <WrapButton style={{ margin: '1rem auto' }} percentageString={'70%'}>
                  <ButtonOutlined disabled={true}>On Sale Soon</ButtonOutlined>
                </WrapButton>
              </div>
              <div style={{ position: 'relative', padding: '2rem', marginTop: '1rem' }}>
                <BubbleBase />
                <NoAccount src={LotteryTicket} />
                <TYPE.main fontSize={13} fontWeight={600}>
                  Sorry, no prize to collect
                </TYPE.main>
                <ReadMoreButton>View Your Tickets</ReadMoreButton>
              </div>
            </LotteryWrap>
          )}
        </LotteryFlex>
        <BodyWrapper>
          <BubbleBase />
          <TYPE.main fontSize={[14, 17, 22]} fontWeight={600}>
            Winning Number This Round
          </TYPE.main>
          <TYPE.white fontWeight={600} fontSize={[33, 42, 55]} style={{ marginTop: '1rem' }}>
            12 01 10 07
          </TYPE.white>
          <TicketMatching>
            <TicketMatchingRow>
              <tbody>
                <tr>
                  <td>
                    <TYPE.main fontSize={[10, 13]} fontWeight={600}>
                      Tickets matching
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.white fontSize={[10, 12, 14]} fontWeight={600}>
                      4
                    </TYPE.white>
                  </td>
                  <td>
                    <TYPE.main fontSize={[10, 13]} fontWeight={600}>
                      numbers:
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.white fontSize={[10, 12, 14]} fontWeight={600}>
                      0
                    </TYPE.white>
                  </td>
                </tr>
              </tbody>
            </TicketMatchingRow>
            <ReadMoreButton>Export recent winning numbers</ReadMoreButton>
          </TicketMatching>
        </BodyWrapper>
      </>
    )
  }
  const showPastDraw = () => {
    return (
      <>
        <SearchGroup>
          <SearchBar value={searchText} onChange={e => setSearchText(e.target.value)} />
        </SearchGroup>
        <LotteryFlex flexStart={true}>
          <LotteryWrap pastDraw={true}>
            <BubbleBase />
            <FlexRow style={{ padding: '0rem 1rem' }}>
              <TYPE.white fontSize={[11, 12, 17]} fontWeight={700}>
                Round #479
              </TYPE.white>
              <TYPE.main fontWeight={500} fontSize={[10, 13]}>
                Apr 18, 14:00 UTC
              </TYPE.main>
            </FlexRow>

            <TicketMatching>
              <TYPE.main fontSize={[10, 13]} fontWeight={600}>
                Total Pot
              </TYPE.main>
              <TYPE.white fontWeight={600} fontSize={[22, 24, 32]} style={{ marginTop: '1rem' }}>
                2,7,4,14
              </TYPE.white>
            </TicketMatching>

            <TicketMatching>
              <TYPE.main fontSize={[10, 13]} fontWeight={600}>
                Total Prize
              </TYPE.main>
              <TYPE.white fontWeight={600} fontSize={[22, 24, 32]} style={{ marginTop: '1rem' }}>
                44,838
              </TYPE.white>
            </TicketMatching>

            <Table>
              <tbody>
                <tr>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      No Matched
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      Winners
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      Prize Pot
                    </TYPE.main>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>455</td>
                  <td>455</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>53443</td>
                  <td>53443</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>6221</td>
                  <td>6221</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <TYPE.main fontWeight={600} fontSize={[10, 13, 13]}>
                      to burn:
                    </TYPE.main>
                  </td>
                  <td>
                    <TYPE.main fontWeight={600} fontSize={[14, 16, 18]}>
                      4343
                    </TYPE.main>
                  </td>
                </tr>
              </tbody>
            </Table>
            <FlexRowButton>
              <WrapButton percentageString={'50%'}>
                <LinkStyledButton>View on BscScan</LinkStyledButton>
              </WrapButton>
              <WrapButton percentageString={'50%'}>
                <ButtonPrimary>View Your Tickets</ButtonPrimary>
              </WrapButton>
            </FlexRowButton>
          </LotteryWrap>
          <HighChartWrap>
          </HighChartWrap>
        </LotteryFlex>
      </>
    )
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
          {isSelected ? (
            <LotteryWrap>
              <BubbleBase />
              <TYPE.white fontWeight={700} fontSize={[22, 24, 32]}>
                How it works
              </TYPE.white>
              <TYPE.main fontSize={14} style={{ marginTop: '1rem' }}>
                Spend Relay to buy tickets, contributing to the lottery pot. WIn prizes if 2, 3, or 4 of your ticket
                numbers match the winning numbers and their exact order
              </TYPE.main>
              <ReadMoreButton>Read More</ReadMoreButton>
            </LotteryWrap>
          ) : (
            <></>
          )}
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
