import { ButtonOutlined } from '../Button'
import Copy from '../AccountDetails/Copy'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Separator } from 'components/SearchModal/styleds'
import { useCrosschainState } from 'state/crosschain/hooks'
import { getCurrencyLogoImage, getLogoByName } from 'components/CurrencyLogo'
import { ProgressBar } from 'components/ProgressBar'
import { getTransferState } from 'api'

const Title = styled.div`
  height: 47px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 32px; 
  text-align: center; 
  color: #38E4DE;
`
const Success = styled(Title)` 
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 21px;
  line-height: 26px;
  text-align: center;
  color: #FFFFFF;
`
const Patient = styled(Success)`
  margin-top: -50px;
  margin-bottom: -30px;
`
const HashBlock = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center; 
  color: #A782F3;
`
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 473px;
  height: 795px; 
  background: #2E2757;
  border: 1px solid #7F46F0;
  box-sizing: border-box;
  box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
`
const DestinationAddress = styled(Copy)`
  margin-top: 16px;
`
const StyledSeparator = styled(Separator)`
  border-bottom: 1px solid #4B408E;
`
const FooterBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 350px;

`
const SocialBlock = styled.div`
  padding: 17px;
  width: 60px;
  height: 60px;
  background: linear-gradient(360deg, rgba(43, 86, 254, 0.05) 0%, rgba(43, 86, 254, 0.1) 107%);
  backdrop-filter: blur(100px);
  border-radius: 17.33px;
`
const IconLink = styled.span`
  display: inline-block;
  margin-right: 30px;
  text-decoration: none;
  cursor: pointer;
  color: #A782F3;
`
const LogoBlock = styled.img`
  height: 25px;
  width: 25px;
`
const AssetTitle = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: #FFFFFF;
`
const TokenLogo = styled.img`
  height: 50px;
  width: 50px;
  margin: -25px 0;
`
const TokenTitle = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 30px;
  line-height: 37px;
  text-align: center;
  color: #FFFFFF;
`
const MainBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 421px;
`
const ChainLogo = styled.img`
  height: 35px;
  width: 35px;
  margin: 10px;
`
const LineBlock = styled.div`
  border: 3px solid rgba(167, 130, 243, 0.1);; 
  width: 50px;
  height: 6px;
`
const BridgeBlock = styled.div`
  position: relative;
  border-radius: 50%;
  width: 144px;
  height: 144px;
  position: relative;
  border-radius: 50%;
  border: 6px solid rgba(167, 130, 243, 0.1); 
  box-shadow: 60px -60px 0 2px @color, -60px -60px 0 2px @color, -60px 60px 0 2px @color, 60px 60px 0 2px @color, 0 0 0 2px #E94E3D;
  &:hover {
    animation: border 4s ease 1 forwards; 
  }

  @keyframes border{
    0% {
      box-shadow: 60px -60px 0 2px @color, -60px -60px 0 2px @color, -60px 60px 0 2px @color, 60px 60px 0 2px @color, 0 0 0 2px #E94E3D;
    }
    25% {
      box-shadow: 0 -125px 0 2px @color, -60px -60px 0 2px @color, -60px 60px 0 2px @color, 60px 60px 0 2px @color, 0 0 0 2px #fff;
    }
    50% {
      box-shadow: 0 -125px 0 2px @color, -125px 0px 0 2px @color, -60px 60px 0 2px @color, 60px 60px 0 2px @color, 0 0 0 2px #fff;
    }
    75% {
      box-shadow: 0 -125px 0 2px @color, -125px 0px 0 2px @color, 0px 125px 0 2px @color, 60px 60px 0 2px @color, 0 0 0 2px #fff;
    }
    100% {
      box-shadow: 0 -125px 0 2px @color, -125px 0px 0 2px @color, 0px 125px 0 2px @color, 120px 40px 0 2px @color, 0 0 0 2px #fff;
    } 
  }
  
`
const BrandBlock = styled.img`
  position: absolute; 
  height: 60px;
  width: 60px;
  top: 35px;
  left: 35px; 
`
const StyledProgressBar = styled(ProgressBar)` 
`
const ProgressBlock = styled.div`
  display: flex;
  flex-direction: column; 
  width: 304px;
`
const CheckBlock = styled.img`
  height: 32px;
  width: 32px;
  margin-right: 10px;
  margin-top: 15px;
  `

const ProgressTitle = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
`

const ProgressInfo = styled.div`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
`
const ProgressContent = styled.div`
  display: flex;
  flex-direction: row;
`
export default function TransferPending({
  onDismiss,
  activeChain,
  transferTo,
  transferAmount,
  currentToken,
  targetTokenAddress
}: {
  onDismiss: () => void
  activeChain?: string
  transferTo?: string
  transferAmount?: string
  currentToken?: any
  targetTokenAddress?: string
}) {
  const { currentTokenImage, currentChain, targetChain, currentTxID } = useCrosschainState()
  const [completedCurrentChain, setCompletedCurrentChain] = useState(0);
  const [completedBridge, setCompletedBridge] = useState(0);
  const [completedTargetChain, setCompletedTargetChain] = useState(0);
  const [startBridgeProgress, setStartBridgeProgress] = useState(false);
  const [startTargetProgress, setStartTargetProgress] = useState(false);
  const [shortHash, setShortHash] = useState('')
  const initArray: any[] = []
  const [transferData, setTransferData] = useState(initArray);

  const openInNewTab = (url: string): void => {
    url = `${currentChain.blockExplorer}/tx/${url}`
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  // useEffect(() => {
  //   getTransferState(currentTxID)
  //     .then((data) => {
  //       if (data.length > 0) {
  //         setTransferData(transferData => [...transferData, ...data])
  //       }
  //     })
  // }, [currentTxID])

  function* addProgress() {
    yield 17;
    yield 23;
    yield 36;
    yield 44;
    yield 52;
    yield 61;
    yield 77;
    yield 83;
    yield 95
    return 100;
  }

  const gen = addProgress()
  const genBridge = addProgress()
  const genTargetChain = addProgress()

  useEffect(() => {
    const startProgress = setInterval(() => {
      const value = gen.next().value
      if (value) {

        setCompletedCurrentChain(value)
      }
      else {
        setStartBridgeProgress(true)
        clearInterval(startProgress)
      }
    }, 2000)
  }, [])

  useEffect(() => {
    let startProgress: any = null
    if (startBridgeProgress) {
      startProgress = setInterval(() => {
        if (transferData.length > 0) {
          const value = genBridge.next().value
          if (value) {
            setCompletedBridge(value)
          } else {
            setStartBridgeProgress(false)
            setStartTargetProgress(true)
            clearInterval(startProgress)
          }
        } else {
          getTransferState(currentTxID)
            .then((data) => {
              if (data.length > 0) {
                setTransferData(transferData => [...transferData, ...data])
              }
            })
        }
      }, 1000)
    }
    return () => {
      clearInterval(startProgress)
    }

  }, [startBridgeProgress, transferData, currentTxID])


  useEffect(() => {
    if (startTargetProgress) {
      const startProgress = setInterval(() => {
        const value = genTargetChain.next().value

        if (value) {
          setCompletedTargetChain(value)
        }
        else {
          setStartTargetProgress(false)
          clearInterval(startProgress)
        }
      }, 1500)
    }
  }, [startTargetProgress])

  useEffect(() => {
    if (currentTxID) {
      setShortHash(`${currentTxID.slice(0, 6)}..${currentTxID.slice(-6)}`)
    }
  }, [currentTxID])
  return (
    <SuccessContainer>
      <Title>Transaction Details</Title>
      <StyledSeparator />
      <Success>Transaction is packing on {currentChain?.name}</Success>
      <Patient>Please be patient...</Patient>
      <HashBlock onClick={() => openInNewTab(currentTxID)}>Hash: {shortHash}</HashBlock>

      <MainBlock>
        <ChainLogo src={getLogoByName(getCurrencyLogoImage(currentChain?.symbol?.toUpperCase()) || 'ETH')} />
        <LineBlock></LineBlock>
        <BridgeBlock>
          <BrandBlock src={require('../../assets/images/relay-icon.png')} />
        </BridgeBlock>
        <LineBlock></LineBlock>
        <ChainLogo src={getLogoByName(getCurrencyLogoImage(targetChain?.name?.toUpperCase()) || 'ETH')} />
      </MainBlock>
      <ProgressContent>
        <CheckBlock src={require('../../assets/svg/check.svg')} />
        <ProgressBlock>
          <ProgressTitle>{currentChain?.symbol?.toUpperCase()}</ProgressTitle>
          <ProgressInfo>The transaction has succeeded on the {currentChain?.symbol?.toUpperCase()}</ProgressInfo>
          <StyledProgressBar bgcolor={"#38E4DE"} completed={completedCurrentChain} total={21} />

        </ProgressBlock>

      </ProgressContent>

      <ProgressContent>

        <CheckBlock src={require('../../assets/svg/check.svg')} />
        <ProgressBlock>
          <ProgressTitle>RELAY</ProgressTitle>
          <ProgressInfo>The transaction is proceeding on Relay</ProgressInfo>
          <StyledProgressBar bgcolor={"#38E4DE"} completed={completedBridge} total={1} />

        </ProgressBlock>
      </ProgressContent>

      <ProgressContent>
        <CheckBlock src={require('../../assets/svg/check.svg')} />
        <ProgressBlock>
          <ProgressTitle> {currentToken?.name}</ProgressTitle>
          <ProgressInfo>The transaction is waiting to be processed</ProgressInfo>
          <StyledProgressBar bgcolor={"#38E4DE"} completed={completedTargetChain} total={1} />

        </ProgressBlock>

      </ProgressContent>


    </SuccessContainer>
  )
} 
