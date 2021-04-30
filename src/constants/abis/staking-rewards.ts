import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as STAKING_REWARDS_FACTORY_ABI } from '@uniswap/liquidity-staker/build/StakingRewardsFactory.json'
import { abi as GONDOLA_STAKING_REWARDS} from './gondola-master.json'

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)
const STAKING_REWARDS_GONDOLA_INTERFACE = new Interface(GONDOLA_STAKING_REWARDS)

const STAKING_REWARDS_FACTORY_INTERFACE = new Interface(STAKING_REWARDS_FACTORY_ABI)

export { STAKING_REWARDS_FACTORY_INTERFACE, STAKING_REWARDS_INTERFACE, STAKING_REWARDS_GONDOLA_INTERFACE }
