import { Pair, Token, TokenAmount } from "@zeroexchange/sdk"
import { PairState } from "data/Reserves"
import { usePairContract } from "../../hooks/useContract"

import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useEffect, useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'

export const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)


export async function getPairState(contract: Contract | null, tokenA: Token | undefined, tokenB: Token | undefined){ // }: Promise<[PairState, Pair | null]> {
    // const { chainId } = useActiveWeb3React() 


    // const result = {result: reserves: null, loading: true} // await contract?.getReserves()

    // console.log("🚀 ~ file: hooks.ts ~ line 17 ~ getPairState ~ result", result)

    // const { result: reserves, loading } = result
    // console.log("🚀 ~ file: hooks.ts ~ line 19 ~ getPairState ~ loading", loading)
    // console.log("🚀 ~ file: hooks.ts ~ line 19 ~ getPairState ~ reserves", reserves)


    // if (loading) return [PairState.LOADING, null]
    // if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
    // if (!reserves) return [PairState.NOT_EXISTS, null]
    // const { reserve0, reserve1 } = reserves
    // const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    // return [
    //     PairState.EXISTS,
    //     new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
    // ]
}

// async function getReserv(contract: Contract | null) {
//     return  await contract?.getReserves()
// }