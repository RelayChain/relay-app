import { getCurrentTvl } from 'api';

let tvlData = 0;
getCurrentTvl().then(tvl => {
    tvlData = tvl;
});

const useTvl = () => tvlData;

export default useTvl;
