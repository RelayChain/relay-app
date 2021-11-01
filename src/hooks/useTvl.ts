import { useEffect, useState } from 'react';

const useTvl = () => {
    const [tvlData, setTvlData] = useState(0)
    useEffect(() => {
        const url = `https://relay-api-33e56.ondigitalocean.app/api/currentTvl`
        fetch(url)
            .then(response => {
                response.json().then(data => {
                    setTvlData(data)
                });
            })
            .catch(err => console.log('err :>> ', err))
    }, [])
    return tvlData
}

export default useTvl;
