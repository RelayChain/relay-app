import { ITopLiquidity } from "pages/Stats/TopLiquidity"
import { useEffect, useState } from "react"

const useTopLiquidity = () => {
    const initialState: ITopLiquidity[] = []
    const [liquidity, setLiquidity] = useState(initialState)
    useEffect(() => {
        fetch(`topLiquidity.json`)
            .then((res) => res.json())
            .then(data => setLiquidity(data))
            .catch(err => console.log('err >> ', err))
    }, [])
    return liquidity
}

export default useTopLiquidity