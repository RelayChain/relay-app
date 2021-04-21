import { Check, Copy } from 'react-feather'
import { Currency, Pair } from '@zeroexchange/sdk'
import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'

// import BlockchainLogo from '../BlockchainLogo'
import BlockchainSearchModal from '../SearchModal/BlockchainSearchModal'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import CurrencyLogo from '../CurrencyLogo'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import DoubleCurrencyLogo from '../DoubleLogo'
import { ReactComponent as DropDown } from '../../assets/images/dropdown-white-select.svg'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { darken } from 'polished'
import { returnBalanceNum } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useTranslation } from 'react-i18next'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
  ${({ theme }) => theme.mediaWidth.upToSmall`
  flex-direction: column;
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  margin-top: 30px;
  margin-left: 0px;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
  right: 10px;
`};
`

const InputPanel = styled.div<{ hideInput?: boolean, transferPage?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  background: ${({ transferPage }) => (transferPage ? 'rgba(18, 21, 56, 0.24)' : 'rgba(18, 21, 56, 0.54)')};
  box-shadow: ${({ transferPage }) => (transferPage ? 'inset 2px 2px 5px rgba(255, 255, 255, 0.12)' : 'inset 2px 2px 5px rgba(255, 255, 255, 0.095)')};
  backdrop-filter: blur(28px);
  border-radius: 44px;
  z-index: 1;
`

const CopyRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: flex-end;
  align-items: center;
  padding-right: 1rem;
  margin-top: -5px;
  p {
    margin-top: 0;
    margin-bottom: 0;
    background: rgba(255, 255, 255, 0.075);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 0.8rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    opacity: 0.75;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    min-height: 25px;
    min-width: 86px;
    span {
      margin-right: 4px;
    }
    .active {
      display: block;
    }
    .inactive {
      display: none;
    }
    &:active {
      opacity: 1;
      .active {
        display: none;
      }
      .inactive {
        display: block;
      }
    }
  }
`

const Container = styled.div<{ hideInput: boolean }>`
  padding: 1rem 1.5rem;
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};

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

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
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
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  isCrossChain,
  transferPage,
  crossChainBalance,
  currentTargetToken
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
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
        <Container hideInput={hideInput}>
          {!hideInput && (
            <LabelRow style={{ marginBottom: '1rem' }}>
              <RowBetween>
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
                        `${selectedCurrencyBalance?.toSignificant(returnBalanceNum(selectedCurrencyBalance, 6), {
                          groupSeparator: ','
                        })}`
                      : ''}
                  </TYPE.body>
                )}
              </RowBetween>
            </LabelRow>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
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
            <CurrencySelect
              style={{ opacity: `${isCrossChain && label === 'To' && !altCurrency?.symbol ? '0' : '1'}` }}
              selected={!!altCurrency}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
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
                          : altCurrency?.symbol) || t('selectToken')}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && !disableBlockchainSelect && <StyledDropDown selected={!!altCurrency} />}
              </Aligner>
            </CurrencySelect>
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
