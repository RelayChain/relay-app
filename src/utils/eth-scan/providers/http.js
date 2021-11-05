import fetch from"isomorphic-unfetch";import uuid from"uuid-random-es";/**
 * A raw HTTP provider, which can be used with an Ethereum node endpoint (JSON-RPC), or an `HttpProviderOptions` object.
 */const provider={isProvider:a=>"string"==typeof a||"object"==typeof a&&void 0!==a.url,send:async(a,b,c)=>{const d="string"==typeof a?a:a.url,e="object"==typeof a?a.params:{},f=getPayload(b,c),g=await fetch(d,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(f),cache:"no-cache",...e});if(!g.ok)throw new Error(`Request failed with HTTP error ${g.status}: ${g.statusText}`);const{error:h,result:i}=await g.json();if(h)throw new Error(`Request failed: ${h.message}`);return i}};export default provider;/**
 * Get the JSON-RPC payload for the `eth_call` function.
 */export const getPayload=(a,b)=>({jsonrpc:"2.0",method:a,params:b,id:uuid()});
//# sourceMappingURL=http.js.map