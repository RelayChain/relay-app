import{decode,toNumber}from"@findeth/abi";import{BATCH_SIZE,CONTRACT_ADDRESS}from"./constants";import{call}from"./providers";import{batch}from"./utils";const isResult=a=>Array.isArray(a)&&2===a.length;/**
 * Get a balance map from an array of addresses and an array of balances.
 *
 * @param {string[]} addresses
 * @param {bigint[]} results
 * @return {BalanceMap}
 */export const toBalanceMap=(a,b)=>b.reduce((b,c,d)=>{const e=isResult(c)?toNumber(c[1].slice(0,32)):c;return{...b,[a[d]]:e}},{});/**
 * Get a nested balance map from an array of addresses, token addresses, and results.
 *
 * @param {string[]} addresses
 * @param {bigint[]} tokenAddresses
 * @param {BalanceMap<BalanceMap>} results
 */export const toNestedBalanceMap=(a,b,c)=>c.reduce((c,d,e)=>({...c,[a[e]]:toBalanceMap(b,d)}),{});/**
 * Low level API function to send a contract call that returns a single Result array. It will automatically retry any
 * failed calls.
 *
 * @param provider
 * @param batchAddresses The addresses to batch by
 * @param addresses The address(es) to use when retrying failed calls
 * @param contractAddresses The contract address(es) to use when retrying failed calls
 * @param encodeData
 * @param encodeSingle
 * @param options
 */export const callSingle=async(a,b,c,d,e,f,g)=>{var h,i;const j=null!==(h=null===g||void 0===g?void 0:g.contractAddress)&&void 0!==h?h:CONTRACT_ADDRESS,k=null!==(i=null===g||void 0===g?void 0:g.batchSize)&&void 0!==i?i:BATCH_SIZE,l=await batch(async b=>{const c=e(b),d=await call(a,j,c);return decode(["(bool,bytes)[]"],d)[0]},k,b);return retryCalls(a,c,d,l,f)};/**
 * Retry calls to the contract directly, if a contract call in the eth-scan contract failed.
 *
 * @param provider
 * @param addresses
 * @param contracts
 * @param results
 * @param encodeData
 */export const retryCalls=async(a,b,c,d,e)=>Promise.all(d.map(async(d,f)=>{if(d[0])return d;const g="string"==typeof b?b:b[f],h="string"==typeof c?c:c[f],i=e(g);try{const b=await call(a,h,i);return[!0,b]}catch{// noop
}return d}));
//# sourceMappingURL=api.js.map