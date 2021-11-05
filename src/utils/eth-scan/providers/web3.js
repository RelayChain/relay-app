import{getPayload}from"./http";/**
 * Web3 provider, which can be used with an instance of the Web3 class.
 */const provider={isProvider:a=>{var b;return(null===a||void 0===a||null===(b=a.currentProvider)||void 0===b?void 0:b.send)!==void 0},send:(a,b,c)=>{const d=getPayload(b,c);return new Promise((b,c)=>{a.currentProvider.send(d,(a,d)=>a?c(a):d?void b(d.result):c(new Error("No response payload")))})}};export default provider;
//# sourceMappingURL=web3.js.map