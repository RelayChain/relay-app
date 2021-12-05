import { Currency, Pair } from '@zeroexchange/sdk'
import { darken } from 'polished'
import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StakingInfo } from 'state/stake/hooks'
import styled, { ThemeContext } from 'styled-components'
import { ReactComponent as SmallDropDown } from '../../assets/images/small-dropdown-white-select.svg'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import BlockchainSearchModal from '../SearchModal/BlockchainSearchModal'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.flexRowNoWrap}
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
`};
`
const StyledNumericalInput = styled(NumericalInput)`
  box-shadow: 3px 0 1px #ffffff40, -3px 0 1px #ffffff40;
`

const InputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  margin-left: 10px;
  transition: all 0.2s ease-in-out;
  min-width: 150px;
  max-width: 220px;
  width: 100%;
  height: 60px;
  background: linear-gradient(180deg, rgba(173, 0, 255, 0.25) 0%, rgba(97, 0, 143, 0.25) 100%);
  border-radius: 30px;
  &:hover {
    filter: brightness(1.1);
    cursor: pointer;
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

const SmallStyledDropDown = styled(SmallDropDown)<{ selected: boolean }>`
  margin: 0 0.25rem 0 0.5rem;
  margin-left: auto;
  width: 24px;
  height: 24px;
`

const InputPanel = styled.div<{ hideInput?: boolean; transferPage?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  &.grayed-out {
    opacity: 0.2;
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
const RowBetweenTransfer = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
flex-direction: column;
gap: 1rem;
`};
`
const StyledBalanceMax = styled.button`
  height: 35px;
  position: absolute;
  border: 2px solid #ad00ff;
  background: linear-gradient(90deg, #ad00ff 0%, #7000ff 100%);
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  right: 10px;
  margin-top: 2px;
  color: #fff;
  transition: all 0.2s ease-in-out;
  padding-left: 10px;
  padding-right: 10px;
  :hover {
    opacity: 0.9;
  }
  :focus {
    outline: none;
  }
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
  grayedOut?: boolean
  stakingInfo?: StakingInfo
  isRightInput?: boolean
  style?: any
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
  stakingInfo,
  isRightInput = false,
  style = { padding: '10px' }
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
      <InputPanel
        id={id}
        transferPage={transferPage}
        style={isRightInput ? { ...style, marginLeft: '20px' } : { ...style }}
      >
        <Container hideInput={hideInput} className={grayedOut ? 'grayed-out' : ''}>
          <InputRow
            style={hideInput ? { padding: '0', borderRadius: '8px', marginTop: '0' } : {}}
            selected={disableCurrencySelect}
          >
            {!hideInput && (
              <InputWrap>
                <StyledNumericalInput
                  className="token-amount-input"
                  value={value}
                  fontSize="32px"
                  transferPage={!!transferPage}
                  onUserInput={val => {
                    onUserInput(val)
                  }}
                />
                {account && altCurrency && showMaxButton && hasABalance && label !== 'To' && (
                  <StyledBalanceMax onClick={onMax}>Max</StyledBalanceMax>
                )}
              </InputWrap>
            )}
            {!hideCurrencySelect && (
              <CurrencySelect
                style={{ opacity: `${isCrossChain && label === 'To' && !altCurrency?.symbol ? '0' : '1'}` }}
                selected={!!altCurrency}
                className={`open-currency-select-button ${hideInput ? 'centered' : ''}`}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    setModalOpen(true)
                  }
                }}
              >
                {pair ? (
                  <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={32} margin={true} />
                ) : altCurrency ? (
                  <CurrencyLogo currency={altCurrency} size={'32px'} style={{ marginLeft: '10px' }} />
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
                          : altCurrency?.symbol) || (
                          <StyledTokenNameDeafult>
                            {!disableCurrencySelect ? t('selectToken') : ''}
                          </StyledTokenNameDeafult>
                        )}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && !disableBlockchainSelect && <SmallStyledDropDown selected={!!altCurrency} />}
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
