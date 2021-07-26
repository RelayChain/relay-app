import { CHAIN_LABELS } from '../../constants'
import { useActiveWeb3React } from 'hooks'
import React, { useMemo, useState } from 'react'
import { CrosschainChain, setTargetChain } from 'state/crosschain/actions'
import { useCrosschainState } from 'state/crosschain/hooks'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import CrossChainModal from 'components/CrossChainModal'

export default function ChainSwitcherContent() {
    const { chainId } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    const {
        availableChains: allChains
    } = useCrosschainState()
    const [crossChainModalOpen, setShowCrossChainModal] = useState(true)
    const hideCrossChainModal = () => {
        setShowCrossChainModal(false)
    }
    
    const onSelectTransferChain = (chain: CrosschainChain) => {
        dispatch(
            setTargetChain({
                chain
            })
        )
    }

    const availableChains = useMemo(() => {
        return allChains.filter(i => i.name !== (chainId ? CHAIN_LABELS[chainId] : 'Ethereum'))
    }, [allChains, chainId])

    return (
        <CrossChainModal
            isOpen={crossChainModalOpen}
            onDismiss={hideCrossChainModal}
            supportedChains={availableChains}
            selectTransferChain={onSelectTransferChain}
            activeChain={chainId ? CHAIN_LABELS[chainId] : 'Ethereum'}
            />
    )
}
