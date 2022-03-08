// import { API_HOST } from 'constants/connection';
import { useEffect, useState } from 'react';
// import { TimeInMs } from 'types/TableDataTypes';

const useStats = (chainId: number) => {
    const [stateData, setStateData] = useState({})
    useEffect(() => {
        // const currentTime = Date.now()
        // const startTime = Math.round((currentTime - 604800000 / 1000))
        // example filters
        // const url = `https://crosschain-api.relaychain.com/transactions?offset=0&limit=1000&&from_timestamp=${chainId}&to_timestamp=1000000000000000&from_chain_id=2&type=stats_simple`
        // const url = `https://crosschain-api.relaychain.com/transactions?type=stats_simple`
        const url = `http://204.48.30.143:3000/transactions?type=stats_simple`
        fetch(url)
            .then(response => {
                response.json().then(data => {
                    setStateData(data)
                });
            })
            .catch(err => console.log('err :>> ', err))
    }, [])
    return stateData
}

export default useStats;
