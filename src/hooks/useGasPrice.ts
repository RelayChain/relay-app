import Web3 from 'web3'
import { useCrosschainState } from 'state/crosschain/hooks';


export default async function useGasPrice(): Promise<any> {
  const { currentChain } = useCrosschainState()
  try {
    const web3CurrentChain = await new Web3(currentChain?.rpcUrl || '')
    const gas = await web3CurrentChain.eth.getGasPrice()
    return gas
  } catch (err) {
    console.log('err :>> ', err);
  }
}
