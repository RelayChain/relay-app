import { useEffect, useState } from 'react';

const useStatInArray = (path: string) => {
    const [txData, setTxData] = useState([])
    useEffect(() => {
        const url = `https://relaybridgestatistics.herokuapp.com/${path}`
        fetch(url)
            .then(response => {
                response.json().then(data => {
                    if (data) {

                        setTxData(data)
                    }
                });
            })
            .catch(err => console.log('useStatInArray err', err))
    }, [])
    return txData
}

export default useStatInArray;
