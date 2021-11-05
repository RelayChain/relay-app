import{toHex}from"@findeth/abi";/**
 * Add 0x-prefix and ABI identifier to an encoded buffer.
 *
 * @param {string} id
 * @param {Uint8Array} data
 * @return {string}
 */export const withId=(a,b)=>`0x${a}${toHex(b)}`;
//# sourceMappingURL=abi.js.map