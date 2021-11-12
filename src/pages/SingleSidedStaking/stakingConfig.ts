import { ChainId } from '@zeroexchange/sdk'

export const StakingConfig: any = {
    [ChainId.AVALANCHE]: {
        stakingContractAddress: '0xE7B1710c87531437aCEfD81A2d2e29973b1e4D73',
        stakedTokenAddress: '0x78c42324016cd91d1827924711563fb66e33a83a',
        rewardsTokenAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
        chainName: 'Avalanche',
        rewardSymbol: 'AVAX',
    },
    // [ChainId.HECO]: {
    //     stakingContractAddress: '0x924F19A9B808573Ca0F7aedEd3aa968Be5112622',
    //     stakedTokenAddress: '0x64e501ca5bada4c9b82b8bb3535ec92075d7412f ',
    //     rewardsTokenAddress: '0x0d4221c6167eaf7d9d2349451fce1d23a0e746fa '
    // },
    [ChainId.MATIC]: {
        stakingContractAddress: '0x7f7a17aA18DDeB9a281776f406F2FF6bD06907F7',
        stakedTokenAddress: '0x904371845Bc56dCbBcf0225ef84a669b2fD6bd0d',
        rewardsTokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        chainName: 'Polygon',
        rewardSymbol: 'MATIC',
    },
    [ChainId.MOONRIVER]: {
        stakingContractAddress: '0xd02408a62ed3708429ccfb04d9dea302884ab6a7',
        stakedTokenAddress: '0xAd7F1844696652ddA7959a49063BfFccafafEfe7',
        rewardsTokenAddress: '0x98878B06940aE243284CA214f92Bb71a2b032B8A',
        chainName: 'Moonriver',
        rewardSymbol: 'MOVR',
    },
}

export const returnStakingConfig = (chainId?: ChainId): any => {
    if (!chainId || !StakingConfig[chainId]) {
        return {};
    }
    return StakingConfig[chainId];
}
