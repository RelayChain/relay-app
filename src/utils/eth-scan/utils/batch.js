/**
 * Split an array per `size` items.
 *
 * @param {T[]} input
 * @param {number} size
 * @return {T[][]} An array of arrays of the specified type.
 * @template T
 */export const chunk=(a,b)=>a.reduce((a,c,d)=>0==d%b?[...a,[c]]:[...a.slice(0,-1),[...a.slice(-1)[0],c]],[]);/**
 * Batch the function calls to `handler` per `size` items.
 *
 * @param {(addresses: string[]) => Promise<T[]>} handler A function that takes a batch of addresses and returns the balance for the addresses.
 * @param {number} size The size of the batches.
 * @param {string[]} addresses The addresses to batch.
 * @return {Promise<T[]>} A promise with the balances.
 * @template T
 */export const batch=async(a,b,c)=>{const d=chunk(c,b);return d.reduce(async(b,c)=>Promise.resolve([...(await b),...(await a(c))]),Promise.resolve([]))};
//# sourceMappingURL=batch.js.map