# Zero Exchange App

[![Lint](https://github.com/zeroexchange/app/workflows/Lint/badge.svg)](https://github.com/zeroexchange/app/actions?query=workflow%3ALint)
[![Tests](https://github.com/zeroexchange/app/workflows/Tests/badge.svg)](https://github.com/zeroexchange/app/actions?query=workflow%3ATests)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for Zero Exchange -- a fork of uniswap providing cross chain liquidity from Ethereum to Avalanche.

- Website: [0.exchange](https://0.exchange/)
- App: [app.0.exchange](https://app.0.exchange)
- Blog: [blog.0.exchange/](https://blog.0.exchange/)
- Twitter: [@OfficialZeroDEX](https://twitter.com/OfficialZeroDEX)
- Email: [hello@0.exchange](mailto:hello@0.exchange)
- Discord: [Zero Exchange](https://discord.com/invite/5xwKdqrtDu)
- Learn More: [Learn More](https://0.exchange/learn-more)

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"`

Note that the interface only works on testnets where both
[Uniswap V2](https://uniswap.org/docs/v2/smart-contracts/factory/) and
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.**
CI checks will run against all PRs.
