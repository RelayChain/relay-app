import { getGasPrices } from 'api';

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

export default function getGasPrice(chainId: number): string {
  return gasPrices[chainId];
}
