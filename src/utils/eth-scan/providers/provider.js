import{fromHex,stripPrefix}from"@findeth/abi";import EIP1193Provider from"./eip-1193";import EthersProvider from"./ethers";import HttpProvider from"./http";import Web3Provider from"./web3";const providers=[EIP1193Provider,EthersProvider,HttpProvider,Web3Provider];export const getProvider=a=>{const b=providers.find(b=>b.isProvider(a));if(!b)throw new Error("Invalid provider type");return b};/**
 * Send a call with the data, using the specified provider. If the provider is not a valid provider type (e.g. not a
 * Ethers.js provider, URL or Web3 provider), this will throw an error.
 *
 * @param {ProviderLike} providerLike
 * @param {string} contractAddress
 * @param {string} data
 * @return {Promise<Uint8Array>}
 */export const call=async(a,b,c)=>{try{const d=await send(a,"eth_call",[{to:b,data:c},"latest"]);if(stripPrefix(d).startsWith("08c379a"))throw new Error("Call reverted");return fromHex(d)}catch(a){var d;throw new Error(`Failed to get data from contract: ${null!==(d=a.stack)&&void 0!==d?d:a.toString()}`)}};export const send=async(a,b,c)=>{const d=getProvider(a);return d.send(a,b,c)};
//# sourceMappingURL=provider.js.map