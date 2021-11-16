import { getGasPrices } from 'api';
import { useCrosschainState } from 'state/crosschain/hooks';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let gasPrices = {};

async function startUpdatingGasPrices() {
  while (true) {
    try {
      gasPrices = await getGasPrices();
      await sleep(60000);
    } catch (e) {
      console.log(`Error retrieving gasPrices from api: ${e}`);
      await sleep(4000);
    }
  }
}

startUpdatingGasPrices();

export default async function useGasPrice(): Promise<any> {
  const { currentChain } = useCrosschainState()
  return gasPrices[currentChain.chainID];
}
