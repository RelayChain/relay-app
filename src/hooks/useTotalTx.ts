import { useEffect, useState } from 'react';

const useTotalData = (path: string) => {
    const [txData, setTxData] = useState(0)
    useEffect(() => {
        const url = `https://relaybridgestatistics.herokuapp.com/${path}`
        if (path) {
            fetch(url)
                .then(response => {
                    response.json().then(data => {
                        if (data) {
                            console.log("🚀 ~ file: useTotalTx.ts ~ line 11 ~ response.json ~ data", data)
                            console.log('Number(Object.values(data) :>> ', Number(Object.values(data)))
                            setTxData(Number(Object.values(data)[0]))
                        }
                    });
                })
                .catch(err => console.log('err :>> ', err))
        }
    }, [])

    return txData
}

export default useTotalData;
