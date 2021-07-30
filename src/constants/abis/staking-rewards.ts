import { Interface } from '@ethersproject/abi'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import { abi as STAKING_REWARDS_FACTORY_ABI } from '@uniswap/liquidity-staker/build/StakingRewardsFactory.json'
import { abi as GONDOLA_STAKING_REWARDS} from './gondola-master.json'
import { abi as GONDOLA_SWAP} from './gondola-swap.json'
import { abi as GONDOLA_PROXY_MASTER}  from './gondolaProxyMaster.json';

const STAKING_REWARDS_INTERFACE = new Interface(STAKING_REWARDS_ABI)
const STAKING_REWARDS_GONDOLA_INTERFACE = new Interface(GONDOLA_STAKING_REWARDS)
const GONDOLA_SWAP_INTERFACE = new Interface(GONDOLA_SWAP)

const STAKING_REWARDS_FACTORY_INTERFACE = new Interface(STAKING_REWARDS_FACTORY_ABI)

export { STAKING_REWARDS_FACTORY_INTERFACE, STAKING_REWARDS_INTERFACE, STAKING_REWARDS_GONDOLA_INTERFACE, GONDOLA_SWAP_INTERFACE, GONDOLA_PROXY_MASTER }
