import { getCrossChainData } from 'api';
import { csConfig } from 'constants/CrosschainConfig';
import ethers, { BigNumber } from 'ethers';
import { useCrosschainState } from 'state/crosschain/hooks';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

class GasPricePoller {
  private static instances: any = {};

  public static getInstance(id: number, rpcUrl: string) {
    if (GasPricePoller.instances[id] == undefined) {
      const poller = new GasPricePoller(id, rpcUrl);

      poller.startPollingGasPrice();

      GasPricePoller.instances[id] = poller;
    }

    return GasPricePoller.instances[id];
  }

  private provider: any;
  private id: number;
  private gasPrice?: BigNumber;

  private constructor(id: number, rpcUrl?: string) {
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.id = id;
  }

  async getGasPrice(): Promise<BigNumber> {
    while (!this.gasPrice) await sleep(1000);
    return this.gasPrice;
  }

  async startPollingGasPrice() {
    while (true) {
      try {
        await this.updateGasPrice();
        await sleep(60000);
      } catch (e) {
        console.log(`Error polling gas price for chain ${this.id}: ${e}`);
        await sleep(5000);
      }
    }
  }

  private async updateGasPrice() {
    const price = await this.provider.getGasPrice();

    const ratios = {
        1: [11, 10],
        2: [11, 10],
        3: [11, 10],
        4: [6, 5],
        5: [10, 1],
        6: [4, 1],
        7: [3, 1],
        8: [5, 1],
        9: [1, 1],
        10: [1, 1],
        11: [1, 1],
    };

    const [mul, div] = ratios[this.id];
    this.gasPrice = price.mul(mul).div(div);
  }
}

// get pollers once for all chains
csConfig().then(data => {
  for (const chain of data.chains) {
    GasPricePoller.getInstance(chain.chainId, chain.rpcUrl);
  }
})

export default async function useGasPrice(): Promise<any> {
  const { currentChain } = useCrosschainState()
  try {
    const instance = GasPricePoller.getInstance(Number(currentChain.chainID), currentChain.rpcUrl || '');
    return await instance.getGasPrice();
  } catch (err) {
    console.log('Error in useGasPrice() :>> ', err);
  }
}
