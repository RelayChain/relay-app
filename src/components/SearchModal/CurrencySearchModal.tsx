import React, { useCallback, useEffect, useState } from 'react'

import { Currency } from '@zeroexchange/sdk'
import { CurrencySearch } from './CurrencySearch'
import Modal from '../Modal'
import useLast from '../../hooks/useLast'
import styled from 'styled-components'

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  isCrossChain?: boolean
}

const StyledModal = styled(Modal)`
  width: 534px;
  height: 842px; 
  background: linear-gradient(180deg, #211A49 0%, #211A49 100%);
  box-shadow: 11px 10px 20px rgba(0, 0, 0, 0.25);
  border-radius: 24px;
`

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  isCrossChain,
  showCommonBases = false,
}: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  const handleClickChangeList = useCallback(() => {
    setListView(true)
  }, [])

  return (
    <StyledModal isOpen={isOpen} onDismiss={onDismiss} minHeight={listView ? 40 : 84} isChainSwitch={true}>
      <CurrencySearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        onCurrencySelect={handleCurrencySelect}
        onChangeList={handleClickChangeList}
        selectedCurrency={selectedCurrency}
        otherSelectedCurrency={otherSelectedCurrency}
        showCommonBases={showCommonBases}
        isCrossChain={isCrossChain}
      />
    </StyledModal>
  )
}
