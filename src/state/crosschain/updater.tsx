import { AppDispatch } from '../index'
import { csConfig } from 'constants/CrosschainConfig'
import { getAllTokenBalances } from '../../utils/getBalance';
import { getCrosschainState } from 'state/crosschain/hooks'
import { setAllChainsData } from './actions'
import { setTokenBalances } from '../user/actions';
import { useActiveWeb3React } from '../../hooks'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
export default function Updater(): null {

  const dispatch = useDispatch<AppDispatch>()
  const { allCrosschainData } = getCrosschainState()
  const { chainId, account } = useActiveWeb3React()

  // keep dark mode in sync with the system
  useEffect(() => {
    csConfig()
      .then(data => {
        dispatch(
          setAllChainsData({
            chainsBridge: data
          }))
      })
  }, [dispatch])

  useEffect(() => {
    if (!chainId) return

    const crossChainConfig: any = allCrosschainData?.chains.find(x => x.networkId === chainId)
    const list = crossChainConfig?.tokens.map((x: any) => x.address);

    if (!list) return;

    const provider = crossChainConfig?.rpcUrl;

    getAllTokenBalances(account, chainId, list, provider).then((res: any) => {
      let tokens: any = crossChainConfig?.tokens;
      let arr = tokens.slice().map((x: any) => {
        return {
          ...x,
          balance: 0,
        }
      });
      if (tokens?.length > 0 && res?.length > 0) {
        for (let r of res) {
          const index = arr.findIndex((x: any) => x.address === r.address);
          arr[index] = {
            ...arr[index],
            balance: r.balance,
          }
        }
      }
      arr.sort((a: any, b: any) => {
        const aVal = parseFloat(a?.balance) || 0
        const bVal = parseFloat(b?.balance) || 0
        return bVal - aVal
      })
      dispatch(setTokenBalances(arr))
    })
  }, [dispatch, chainId, allCrosschainData, account])

  return null
}
