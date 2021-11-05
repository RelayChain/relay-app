import{getPayload}from"./http";/**
 * EIP-1193 provider, which can be used with the `window.ethereum` object.
 */const provider={isProvider:a=>void 0!==(null===a||void 0===a?void 0:a.request),send:async(a,b,c)=>{const d=getPayload(b,c);return a.request(d)}};export default provider;
//# sourceMappingURL=eip-1193.js.map