import { Currency, Pair } from '@zeroexchange/sdk'
import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import BlockchainSearchModal from '../SearchModal/BlockchainSearchModal'
import CurrencyLogo from '../CurrencyLogo'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ReactComponent as DropDown } from '../../assets/images/dropdown-white-select.svg'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import { ReactComponent as SmallDropDown } from '../../assets/images/small-dropdown-white-select.svg'
import { TYPE } from '../../theme'
import { darken } from 'polished'
import { returnBalanceNum } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useTranslation } from 'react-i18next'
import { StakingInfo } from 'state/stake/hooks'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
padding: 0;
margin-top: 25px;
`};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background: rgba(225, 248, 250, 0.12);
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 54px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  margin-left: 20px;
  user-select: none;
  transition: all 0.2s ease-in-out;
  border: none;
  padding: 0 0.5rem;
  width: 186px;
  height: 40px;
  :focus,
  :hover {
    background: rgba(225, 248, 250, 0.16);
  }
  &.centered {
    margin-left: auto;
    margin-right: auto;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  margin-top: 15px;
  margin-left: 0px;
  &.centered {
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
  }
`};
`

const LabelRow = styled.div`
  position: relative;
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  justify-content: flex-start;

`};
`
const SectionLabel = styled.span`
  display: flex;
  color: #a7b1f4 !important;
  font-weight: bold;
  cursor: auto;
  opacity: 0.56;
  font-size: 13px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  text-align: center;
`};
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 3.5px;
  }
  position: absolute;
  height: 100%;
  right: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: none
`};
`

const SmallStyledDropDown = styled(SmallDropDown)<{ selected: boolean }>`
  display: none;
  margin: 0 0.25rem 0 0.5rem;
  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 3.5px;
  }
  position: absolute;
  height: 100%;
  right: 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  display: block;
  position: static;
`};
`

const InputPanel = styled.div<{ hideInput?: boolean; transferPage?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  background: ${({ transferPage }) => (transferPage ? 'rgba(18, 21, 56, 0.24)' : 'rgba(18, 21, 56, 0.54)')};
  box-shadow: ${({ transferPage }) =>
    transferPage ? 'inset 2px 2px 5px rgba(255, 255, 255, 0.12)' : 'inset 2px 2px 5px rgba(255, 255, 255, 0.095)'};
  backdrop-filter: blur(28px);
  border-radius: 44px;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  padding: 1rem 1.5rem;
  &.grayed-out {
    opacity: .2;
    pointer-events: none;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 15px;
  line-height: 100%;
`};
`
const StyledTokenNameDeafult = styled(StyledTokenName)`
  font-size: 16px;
  margin: 0 0.25rem 0 0.25rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  margin: 0;
  font-size: 12px;
`};
`
const TokenNameAligner = styled(Aligner)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  align-items: center;
  justify-content: space-between;
`};
`
const RowBetweenTransfer = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
flex-direction: column;
gap: 1rem;
`};
`
const StyledBalanceMax = styled.button`
  height: 35px;
  border: 2px solid #1ef7e7;
  background: transparent;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: #1ef7e7;
  transition: all 0.2s ease-in-out;
  padding-left: 10px;
  padding-right: 10px;
  :hover {
    opacity: 0.9;
  }
  :focus {
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 15px auto 0;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  blockchain?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  onBlockchainSelect?: (blockchain: Currency) => void
  currency?: any
  disableCurrencySelect?: boolean
  disableBlockchainSelect?: boolean
  hideBalance?: boolean
  hideCurrencySelect?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  isCrossChain?: boolean
  crossChainBalance?: string
  currentTargetToken?: any
  transferPage?: boolean
  grayedOut?: boolean;
  stakingInfo?: StakingInfo
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  onBlockchainSelect,
  currency,
  blockchain,
  disableCurrencySelect = false,
  disableBlockchainSelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  hideCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  isCrossChain,
  transferPage,
  crossChainBalance,
  currentTargetToken,
  grayedOut = false,
  stakingInfo
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  // eslint-disable-next-line
  const [modal2Open, setModal2Open] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined, chainId)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const hasABalance = !!(selectedCurrencyBalance && parseFloat(selectedCurrencyBalance.toSignificant(6)) > 1 / 10e18)

  // hack to fix AWAX
  let altCurrency = currency
  if (altCurrency?.symbol.includes('AWAX')) {
    altCurrency.symbol = altCurrency.symbol.replace('AWAX', 'AVAX')
  }

  return (
    <>
      <InputPanel id={id} transferPage={transferPage}>
        <Container hideInput={hideInput} className={ grayedOut ? 'grayed-out' : ''}>
          {!hideInput && (
            <LabelRow style={{ marginBottom: '1rem' }}>
              <RowBetweenTransfer>
                <SectionLabel>{label}</SectionLabel>
                {account && (
                  <TYPE.body
                    onClick={hasABalance ? onMax : () => {}}
                    color={theme.text2}
                    fontWeight={500}
                    fontSize={14}
                    style={{ display: 'inline', cursor: 'pointer' }}
                  >
                    {!hideBalance && !!altCurrency && selectedCurrencyBalance && hasABalance
                      ? (customBalanceText ?? 'Balance: ') +
                        `${selectedCurrencyBalance
                          ?.toSignificant(returnBalanceNum(selectedCurrencyBalance, 6), {
                          groupSeparator: ','
                        })}`
                      : ''}
                  </TYPE.body>
                )}
              </RowBetweenTransfer>
            </LabelRow>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px', marginTop: '0' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  fontSize="32px"
                  transferPage={!!transferPage}
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                />
                {account && altCurrency && showMaxButton && hasABalance && label !== 'To' && (
                  <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                )}
              </>
            )}
            {!hideCurrencySelect && (
              <CurrencySelect
                style={{ opacity: `${isCrossChain && label === 'To' && !altCurrency?.symbol ? '0' : '1'}` }}
                selected={!!altCurrency}
                className={`open-currency-select-button ${ hideInput ? 'centered' : ''}`}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true)
                  }
                }}
              >
                <TokenNameAligner>
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={32} margin={true} />
                  ) : altCurrency ? (
                    <CurrencyLogo currency={altCurrency} size={'32px'} />
                  ) : null}
                  {pair ? (
                    <StyledTokenName className="pair-name-container">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </StyledTokenName>
                  ) : (
                    <StyledTokenName
                      className="token-symbol-container"
                      active={Boolean(altCurrency && altCurrency.symbol)}
                    >
                      {isCrossChain && label === 'To'
                        ? `${currentTargetToken?.symbol ? currentTargetToken?.symbol : '-'}`
                        : (altCurrency && altCurrency.symbol && altCurrency.symbol.length > 20
                            ? altCurrency.symbol.slice(0, 4) +
                              '...' +
                              altCurrency.symbol.slice(altCurrency.symbol.length - 5, altCurrency.symbol.length)
                            : altCurrency?.symbol) ||
                            <StyledTokenNameDeafult>
                              { !disableCurrencySelect ? t('selectToken') : ''}
                            </StyledTokenNameDeafult>}
                    </StyledTokenName>
                  )}
                  {!disableCurrencySelect && !disableBlockchainSelect && <StyledDropDown selected={!!altCurrency} />}
                  {!disableCurrencySelect && !disableBlockchainSelect && (
                    <SmallStyledDropDown selected={!!altCurrency} />
                  )}
                </TokenNameAligner>
              </CurrencySelect>
            )}
          </InputRow>
        </Container>
        {!disableCurrencySelect && onCurrencySelect && (
          <CurrencySearchModal
            isOpen={modalOpen}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={altCurrency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={!isCrossChain}
            isCrossChain={isCrossChain}
          />
        )}
        {!disableBlockchainSelect && onBlockchainSelect && (
          <BlockchainSearchModal
            isOpen={modal2Open}
            onDismiss={handleDismissSearch}
            onCurrencySelect={onBlockchainSelect}
            selectedCurrency={altCurrency}
            otherSelectedCurrency={otherCurrency}
            showCommonBases={showCommonBases}
          />
        )}
      </InputPanel>
      {/*altCurrency && altCurrency?.address && (
        <CopyRow>
          <CopyToClipboard text={altCurrency?.address}>
            <p>
              <span className="active">address</span>
              <Copy className="active" size={'14'} />
              <span className="inactive" style={{ color: 'green' }}>
                copied!
              </span>
              <Check className="inactive" color="green" size={'14'} />
            </p>
          </CopyToClipboard>
        </CopyRow>
      )*/}
    </>
  )
}
