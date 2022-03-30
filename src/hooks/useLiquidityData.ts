import { useEffect, useState } from 'react';

const useLiquidityData = () => {
    const initArray: any[] = []
    const [liquidity, setLiquidity] = useState(initArray)
    useEffect(() => {
        const url = `https://relaybridgestatistics.herokuapp.com/liquidity`
        fetch(url)
            .then(response => {
                response.json().then(data => {
                    setLiquidity(data)
                });
            })
            .catch(err => console.log('useLiquidityData err', err))
    }, [])
    return liquidity
}

export default useLiquidityData
