import{encode}from"@findeth/abi";import{callSingle,toBalanceMap,toNestedBalanceMap}from"./api";import{BALANCE_OF_ID,BALANCE_OF_TYPE,ETHER_BALANCES_ID,ETHER_BALANCES_TYPE,TOKEN_BALANCES_ID,TOKEN_BALANCES_TYPE,TOKENS_BALANCE_ID,TOKENS_BALANCE_TYPE}from"./constants";import{withId}from"./utils";/**
 * Get the Ether balances for the addresses specified.
 *
 * @param {ProviderLike} provider
 * @param {string[]} addresses
 * @param {EthScanOptions} options
 * @return {Promise<BalanceMap>}
 */export const getEtherBalances=async(a,b,c)=>{const d=await callSingle(a,b,[],[],a=>withId(ETHER_BALANCES_ID,encode(ETHER_BALANCES_TYPE,[a])),()=>"",c);return toBalanceMap(b,d)};/**
 * Get the ERC-20 token balances of the token with the address `tokenAddress` for the addresses
 * specified.
 *
 * @param {ProviderLike} provider
 * @param {string[]} addresses
 * @param {string} tokenAddress
 * @param {EthScanOptions} options
 * @return {Promise<BalanceMap>}
 */export const getTokenBalances=async(a,b,c,d)=>{const e=await callSingle(a,b,b,c,a=>withId(TOKEN_BALANCES_ID,encode(TOKEN_BALANCES_TYPE,[a,c])),a=>withId(BALANCE_OF_ID,encode(BALANCE_OF_TYPE,[a])),d);return toBalanceMap(b,e)};/**
 * Get the ERC-20 token balances for multiple contracts, for multiple addresses.
 *
 * @param {ProviderLike} provider
 * @param {string[]} addresses
 * @param {string[]} tokenAddresses
 * @param {EthScanOptions} options
 * @return {Promise<BalanceMap<BalanceMap>>}
 */export const getTokensBalances=async(a,b,c,d)=>{const e=await Promise.all(b.map(async b=>Object.values(await getTokensBalance(a,b,c,d))));return toNestedBalanceMap(b,c,e)};/**
 * Get the ERC-20 token balance of the tokens with the addresses `tokenAddresses` for the single
 * address specified.
 *
 * @param {ProviderLike} provider
 * @param {string} address
 * @param {string[]} tokenAddresses
 * @param {EthScanOptions} options
 * @return {Promise<BalanceMap>}
 */export const getTokensBalance=async(a,b,c,d)=>{const e=await callSingle(a,c,b,c,a=>withId(TOKENS_BALANCE_ID,encode(TOKENS_BALANCE_TYPE,[b,a])),()=>withId(BALANCE_OF_ID,encode(BALANCE_OF_TYPE,[b])),d);return toBalanceMap(c,e)};
//# sourceMappingURL=eth-scan.js.map