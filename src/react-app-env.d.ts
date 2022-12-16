/// <reference types="react-scripts" />
declare module 'fortmatic'
declare module 'react-toast-notifications'
interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    request?: (...args: any[]) => Promise<any>
    enable?: () => Promise<any>
  }
  web3?: {
    currentProvider?: any
  }
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}
