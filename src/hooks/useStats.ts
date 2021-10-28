// import { API_HOST } from 'constants/connection';
import { useEffect, useState } from 'react';
// import { TimeInMs } from 'types/TableDataTypes';

const useStats = (chainId: number) => {
    const [stateData, setStateData] = useState({})
    useEffect(() => {
        const currentTime = Date.now()
        const startTime = Math.round((currentTime - 604800000 / 1000))
        const url = `https://crosschain-api.relaychain.com/transactions?type=stats_simple`
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
