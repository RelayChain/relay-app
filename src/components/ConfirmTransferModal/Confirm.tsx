import { ButtonOutlined, ButtonPrimary } from '../Button'
import { CheckCircle, ChevronsRight } from 'react-feather'

import { AutoColumn } from '../Column'
import { ChainTransferState, setCrosschainTransferStatus } from '../../state/crosschain/actions'
import React, { useEffect } from 'react'
import { RowFixed } from '../Row'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useAddPopup } from '../../state/application/hooks'
import { useCrosschainHooks, useCrosschainState } from '../../state/crosschain/hooks'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { getCurrencyLogoImage, getLogoByName } from 'components/CurrencyLogo'

const Section = styled(AutoColumn)`
    padding: 24px;
    height: 761px; 
`
const ConfirmButton = styled(ButtonOutlined)`
    width: 421px;
    height: 60px; 
    background: linear-gradient(90deg, #AD00FF 0%, #7000FF 100%);
    border-radius: 51px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 61px;
    text-align: center;
    color: #FFFFFF;
    margin-top: 1rem;    
`
const ButtonsBlock = styled.div`
margin: 0 auto;
`
const BackButton = styled(ConfirmButton)`
    background: linear-gradient(90deg, #5A3C97 0%, #5A3C97 100%);
`
const StyledTitle = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 60px;
    line-height: 55px;
    text-align: center;
    color: #FFFFFF;
    margin-bottom: 30px;
`
const FromBlock = styled.div`
    width: 450px;
    height: 220px;  
    display: flex;  
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #2E2757;
    box-sizing: border-box;
    box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
    border-radius: 24px;
    padding: 0 auto;
`
const MiddleBlock = styled.div`
    height: 13px; 
    background: #2E2757;
    width: 100px;
    position: relative; 
    margin: 0 auto;
    box-sizing: border-box;
    background: #2E2757;
    &::before {
        background: #211A4A; 
        box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);  
        height: 13px;
        width: 13px;
        border-radius: 0 40% 50% 0;
        content: '';
        position: absolute;
        top: 0px;
        left: 0px;
    }
    &::after{
        background: #211A4A; 
        box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
        height: 13px;
        width: 13px;
        border-radius: 40% 0 0 50%;
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
    }
`
const ToBlock = styled(FromBlock)`
    height: 260px; 
`
const Label = styled.div`
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 15px;
    color: #A782F3; 
    margin-bottom: 10px;
`
const ChainBlock = styled.div`
    width: 423px;
    height: 35px;
    background: rgba(127, 70, 240, 0.47);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    border-radius: 58px;
    display: flex;
    flex-direction: row;
    align-items: center;
`
const AmountBlock = styled(ChainBlock)`
    background: #211A4A;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05); 
`
const InputBlock = styled.div`
    height: 60px;
    margin-top: 10px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 17px;
    line-height: 21px;

    color: #FFFFFF;
`
const LogoToken = styled.img`
    width: 25px;
    height: 25px;
    margin: 5px 10px;
    `
const EmptyRight = styled.div`

`
const ConnectBlock = styled.div`
  display: flex;
  flex-direction: row;
`
export default function Confirm({
    changeTransferState,
    onDismiss
}: any) {
    const {
        currentTxID,
        availableChains: allChains,
        currentChain,
        currentToken,
        currentTokenImage,
        transferAmount,
        crosschainFee,
        targetChain,
        crosschainTransferStatus,
        swapDetails,
        currentBalance,
        allCrosschainData
    } = useCrosschainState()
    const { GetAllowance, BreakCrosschainSwap } = useCrosschainHooks()
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {

    }, [crosschainTransferStatus, changeTransferState])
    const cancelTransfer = () => {
        BreakCrosschainSwap()
        onDismiss();
    }

    const handleStartTransfer = async () => {
        try {
            await GetAllowance()
            if (crosschainTransferStatus !== ChainTransferState.Confirm) {
                changeTransferState(crosschainTransferStatus)
            }

        } catch (err) {
            cancelTransfer();
        }
    }

    return (
        <Section style={{ justifyContent: "center" }}>
            <StyledTitle>Confirm</StyledTitle>
            <FromBlock>
                <InputBlock>
                    <Label>
                        Origin network
                    </Label>
                    <ChainBlock>
                        <LogoToken src={getLogoByName(getCurrencyLogoImage(currentChain?.symbol) || 'ETH')} /> {currentChain?.name?.toUpperCase()}
                    </ChainBlock>
                </InputBlock>
                <InputBlock>
                    <Label>
                        Amount
                    </Label>
                    <AmountBlock>
                        <LogoToken src={currentTokenImage} /> {currentToken?.name?.toUpperCase()}  {transferAmount}
                    </AmountBlock>
                </InputBlock>

            </FromBlock>
            <ConnectBlock>
                <EmptyRight></EmptyRight>
                <MiddleBlock>
                </MiddleBlock>
                <EmptyRight></EmptyRight>
            </ConnectBlock>
            <ToBlock>
                <InputBlock>
                    <Label>
                        Destination network
                    </Label>
                    <ChainBlock>
                        <LogoToken src={getLogoByName(getCurrencyLogoImage(targetChain?.name) || 'ETH')} /> {targetChain?.name?.toUpperCase()}
                    </ChainBlock>
                </InputBlock>
                <InputBlock>
                    <Label>
                        You will receive
                    </Label>
                    <AmountBlock>
                        <LogoToken src={currentTokenImage} /> {currentToken?.name?.toUpperCase()}  {transferAmount}
                    </AmountBlock>
                </InputBlock>
                <InputBlock>
                    <Label>
                        Fee
                    </Label>
                    <AmountBlock>
                        <LogoToken src={currentTokenImage} /> {currentChain?.symbol?.toUpperCase()} {crosschainFee}
                    </AmountBlock>
                </InputBlock>
            </ToBlock>
            <ButtonsBlock>
                <BackButton
                    onClick={() => onDismiss()}
                >
                    BACK
                </BackButton>
                <ConfirmButton
                    onClick={() => handleStartTransfer()}
                >
                    CONFIRM
                </ConfirmButton>
            </ButtonsBlock>

        </Section>
    )
}
