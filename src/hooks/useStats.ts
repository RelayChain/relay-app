// import { API_HOST } from 'constants/connection';
import { useEffect, useState } from 'react';

// import { TimeInMs } from 'types/TableDataTypes';
import { getCurrentStats } from 'api';

const useStats = (chainId: number) => {
    const [stateData, setStateData] = useState({})
    useEffect(() => {
        getCurrentStats().then((data) => {
          setStateData(data ?? {})
        }).catch(err => console.log('err :>> ', err))
    }, [])
    return stateData
}

export default useStats;
