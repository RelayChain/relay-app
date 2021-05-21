import StakingControls from './StakingControls'
import StakingHeader from './StakingHeader'
import StakingInfoBlock from './StakingInfoBlock'
import StakingCard from './StakingCard'
import StakingRoiModal from './StakingRoiModal'
import StakingClaimModal from './StakingClaimModal'

export interface StakingModalProps {
    open: boolean
    setOpen: (open: boolean) => void
  }

export { StakingControls, StakingHeader, StakingInfoBlock, StakingCard, StakingRoiModal, StakingClaimModal }
