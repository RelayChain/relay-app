export type TokenConfig = {
    address: string;
    name?: string;
    symbol?: string;
    imageUri?: string;
    resourceId: string;
    isNativeWrappedToken?: boolean;
};

export type BridgeConfig = {
    chainId: number;
    networkId: number;
    name: string;
    bridgeAddress: string;
    erc20HandlerAddress: string;
    rpcUrl: string;
    type: "Ethereum" | "Substrate";
    tokens: TokenConfig[];
    nativeTokenSymbol: string;
    //This should be the full path to display a tx hash, without the trailing slash, ie. https://etherscan.io/tx
    blockExplorer?: string;
    defaultGasPrice?: number;
};

export type ChainbridgeConfig = {
    chains: BridgeConfig[];
};

export const crosschainConfig: ChainbridgeConfig = {
    // rinkeby - FUJI
    chains: [
        {
            chainId: 0,
            networkId: 4,
            name: "Ethereum",
            bridgeAddress: "0x06E4d0FCd55eacb617dFCd0C5e75D8b005894bD2",
            erc20HandlerAddress: "0x754977d76601b473474Ba8FBac0Fa2A20Aa84694",
            rpcUrl: "https://rinkeby.infura.io/v3/b1923d2921b84d32bf392c656c4b6169",
            type: "Ethereum",
            blockExplorer: "https://ropsten.etherscan.io/tx",
            nativeTokenSymbol: "Mock",
            tokens: [
                {
                    address: "0xBef34a5f6624DfDBED42fBda56759Be39CfDd696",
                    name: "An ERC20",
                    symbol: "wETC",
                    resourceId:
                        "0x000000000000000000000080F62f18bf8C48580EC4f3769afC89FEF9ca45e001",
                },
            ],
        },
        {
            chainId: 1,
            networkId: 43113,
            name: "Avalanche",
            bridgeAddress: "0xeef5d5C87cDD5F1c2ec89AC6c7B86EeB76299603",
            erc20HandlerAddress: "0x267d83dD863cbc4E7926CbF776E392a937C65533",
            rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
            type: "Ethereum",
            blockExplorer: "https://blockscout.com/etc/kotti/tx",
            nativeTokenSymbol: "AVA",
            defaultGasPrice: 523,
            tokens: [
                {
                    address: "0x80F62f18bf8C48580EC4f3769afC89FEF9ca45e0",
                    name: "An ERC20",
                    symbol: "ERC20",
                    resourceId:
                        "0x0000000000000000000000Bef34a5f6624DfDBED42fBda56759Be39CfDd69601",
                },
            ],
        },
    ],

    // DEVNET
    //   erc20ResourceId:
    //   "0x00000000000000000000000021605f71845f372A9ed84253d2D024B7B10999f4",
    // chains: [
    // {
    //   chainId: 1,
    //   networkId: 5,
    //   name: "Ethereum - A",
    //   bridgeAddress: "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B",
    //   erc20HandlerAddress: "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF",
    //   rpcUrl: "http://localhost:8545",
    //   type: "Ethereum",
    //   tokens: [
    //     {
    //       address: "0x21605f71845f372A9ed84253d2D024B7B10999f4",
    //       name: "Test EthA",
    //       symbol: "TESTA",
    //       imageUri: ETHIcon,
    //     },
    //   ],
    // },
    // {
    //   chainId: 2,
    //   networkId: 6,
    //   name: "Ethereum - B",
    //   bridgeAddress: "0x62877dDCd49aD22f5eDfc6ac108e9a4b5D2bD88B",
    //   erc20HandlerAddress: "0x3167776db165D8eA0f51790CA2bbf44Db5105ADF",
    //   rpcUrl: "http://localhost:8546",
    //   type: "Ethereum",
    //   tokens: [
    //     {
    //       address: "0x21605f71845f372A9ed84253d2D024B7B10999f4",
    //       name: "Test EthB",
    //       symbol: "TESTB",
    //       imageUri: ETHIcon,
    //     },
    //   ],
    // },
    // ]
};
