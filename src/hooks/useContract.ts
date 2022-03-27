import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
} from '../constants/abis/argent-wallet-detector'
import { ChainId, WETH } from '@zeroexchange/sdk'
import { GOVERNANCE_ADDRESS, MERKLE_DISTRIBUTOR_ADDRESS, UNI } from '../constants'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'

import { Contract } from '@ethersproject/contracts'
import {GONDOLA_PROXY_MASTER} from '../constants/abis/staking-rewards';
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ZERO_FREE_CLAIM from '../constants/abis/zerro-free-claim.json'
import WDS_DEPOSIT_ABI from '../constants/abis/wds-deposit.json'
import WISE_SALE_ABI from '../constants/abis/wise-sale.json'
import RELAY_SALE_ABI from '../constants/abis/relay-sale.json'
import ZERO_ABI from '../constants/abis/zero.json';
import STAKING_ABI from '../constants/abis/stakingRewardsStandAlone.json';
import ERC20_ABI from '../constants/abis/erc20.json'
import { ERC20_BYTES32_ABI, ERC20_GONDOLA_INTERFACE } from '../constants/abis/erc20'
import { abi as GOVERNANCE_ABI } from '@uniswap/governance/build/GovernorAlpha.json'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@uniswap/merkle-distributor/build/MerkleDistributor.json'
import { abi as STAKING_REWARDS_ABI } from '@uniswap/liquidity-staker/build/StakingRewards.json'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { abi as GONDOLA_MASTER_CHEF } from '../constants/abis/gondola-master.json'
import { abi as UNI_ABI } from '@uniswap/governance/build/Uni.json'
import WETH_ABI from '../constants/abis/weth.json'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { useMemo } from 'react'
import { GONDOLA_SWAP_INTERFACE } from 'constants/abis/staking-rewards'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error(`Failed to get contract ${address}`, error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
      case ChainId.FUJI:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.AVALANCHE:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.SMART_CHAIN:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.SMART_CHAIN_TEST:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.MOONBASE_ALPHA:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.MUMBAI:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.MATIC:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
      case ChainId.HECO:
        address = '0x59F49F35495854023983C877A7781eAb3A63A0f2'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useGovernanceContract(): Contract | null {
  return useContract(GOVERNANCE_ADDRESS, GOVERNANCE_ABI, true)
}

export function useUniContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? UNI[chainId].address : undefined, UNI_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useStakingGondolaContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, GONDOLA_MASTER_CHEF, withSignerIfPossible)
}

export function useGondolaMasterChefContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, GONDOLA_MASTER_CHEF, withSignerIfPossible)
}

export function useGondolaProxyMasterChefContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, GONDOLA_PROXY_MASTER, withSignerIfPossible)
}


export function useGondolaLpTokenContract(lpAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(lpAddress, ERC20_GONDOLA_INTERFACE, withSignerIfPossible)
}

export function useGondolaSwapContract(swapContractAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(swapContractAddress, GONDOLA_SWAP_INTERFACE, withSignerIfPossible)
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET || chainId === ChainId.RINKEBY
      ? '0x65770b5283117639760beA3F867b69b3697a91dd'
      : undefined,
    UNISOCKS_ABI,
    false
  )
}

export function useZeroFreeClaimContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ZERO_FREE_CLAIM, withSignerIfPossible)
}

export function useWDSDepositContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, WDS_DEPOSIT_ABI, withSignerIfPossible)
}

export function useWISESaleContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, WISE_SALE_ABI, withSignerIfPossible)
}

export function useRelayaleContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, RELAY_SALE_ABI, withSignerIfPossible)
}

export function useZeroContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ZERO_ABI, withSignerIfPossible)
}

export function useRelayTokenContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ZERO_ABI, withSignerIfPossible)
}

export function useStakingAloneContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, STAKING_ABI, withSignerIfPossible)
}