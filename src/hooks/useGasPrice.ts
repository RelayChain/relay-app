import { getCrossChainData } from 'api';
import { csConfig } from 'constants/CrosschainConfig';
import ethers, { BigNumber } from 'ethers';
import { useCrosschainState } from 'state/crosschain/hooks';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

let gasPrices = {};


async function startUpdatingGasPrices() {
  const url = `https://relay-api-33e56.ondigitalocean.app/api/gasPrices`;
  while (true) {
    try {
      // gasPrices = get url
      await sleep(60000);
    } catch (e) {
      console.log(`Error retrieving gasPrices from ${url}`);
      await sleep(4000);
    }
  }
}

startUpdatingGasPrices();

export default async function useGasPrice(): Promise<any> {
  const { currentChain } = useCrosschainState()
  return gasPrices[currentChain.chainID];
}
