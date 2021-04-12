import { gql } from '@apollo/client'

const zeroDayDatas = gql`
  query GetExchangeRates {
    zeroDayDatas {
      date
      dailyVolumeUSD
      totalLiquidityUSD
    }
  }
`

export default zeroDayDatas
