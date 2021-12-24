import { useState } from 'react';

const useTotalTxByChain = (chains: string[]) => {
    const initArray: any[] = []
    const [prom, setProm] = useState(initArray)
    const [loadFlag, setLoadFlag] = useState(true)

    if (loadFlag) {
        try {
            const requests = chains.map((chain, ind) => {
                const url = `https://relaybridgestatistics.herokuapp.com/total_txn?&destination_chain=${chain}`
                if (ind === chains.length - 1) {
                    setLoadFlag(false)
                }
                return fetch(url)
            })

            Promise.all(requests)
                .then(responses => {
                    return Promise.allSettled(responses.map((response, num) => { return response.json() }))
                })
                .then(total => {
                    setProm(total)
                })
        } catch (err) {
            console.log('err:>> ', err);
        }

    }
    return prom
}

export default useTotalTxByChain
