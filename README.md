# Relay Chain App

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for RelayChain -- a fork of uniswap providing cross chain bridges from and to Ethereum, Avalanche, Binance, Heco, Moonriver and Polygon.

- Website: [relaychain.com](https://relaychain.com/)
- App: [app.relaychain.com](https://app.relaychain.com)
- Blog: [https://medium.com/@Relay_Chain/](https://medium.com/@Relay_Chain)
- Twitter: [@relay_chain](https://twitter.com/relay_chain)
- Email: [hello@relaychain.com](mailto:hello@relaychain.com)
- Discord: [RelayChain](https://discord.com/invite/5xwKdqrtDu)
- Learn More: [Learn More](https://docs.relaychain.com/)

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
