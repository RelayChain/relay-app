import { AutoColumn, ColumnCenter } from '../Column'
import { CheckCircle, XCircle } from 'react-feather'
import { Currency, ETHER, Token } from '@zeroexchange/sdk'

import Circle from '../../assets/images/circle-grey.svg'
import CurrencyLogo from '../CurrencyLogo'
import { CustomLightSpinner } from '../../theme/components'
import React from 'react'
import Row from '../Row';
import { Text } from 'rebass'
import styled from 'styled-components'

const ListItem = styled.div`
  display: flex;
  width: 100%;
  padding: 1rem;
  background: rgba(255,255,255,.085);
  margin-bottom: .5rem;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  p {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: bold;
    font-size: .9rem;
    span {
      margin-left: 10px;
    }
  }
  .status {
    display: flex;
    margin-left: auto;
    font-size: .85rem;
    flex-direction: row;
    align-items: center;
  }
`

export default function ChainBridgeItem ({ item, children, ...rest }: { item: any, children: any }) {

  const currency = {
    decimals: item.decimals,
    symbol: item.symbol,
    name: item.name,
    address: item.address,
  };

  const message = {
    ['WaitingRelayers']: 'Relayers Pending',
    ['MintingToken']: 'Minting Token',
    ['TokenMinted']: 'Transfer Success',
    ['Cancelled']: 'Cancelled',
  }

  return (
    <ListItem>
      <CurrencyLogo size="16px" style={{ marginRight: '8px' }} currency={currency} />
      <p>
        { item?.symbol }
        <span>{ item?.amount}</span>
      </p>
      <div className="status">
        { message[item?.state]}

        { item?.state === 'WaitingRelayers' || item?.state === 'MintingToken' ?
          <CustomLightSpinner src={Circle} alt="loader" size={'16px'} style={{ marginLeft: '6px'}} /> : ''
        }
        { item?.state === 'TokenMinted' &&
        <CheckCircle size={'16'} style={{ marginLeft: '6px', color: '#27AE60' }} />
        }
        { item?.state === 'Cancelled' &&
        <XCircle size={'16'} style={{ marginLeft: '6px', color: '#ff007a' }} />
        }
      </div>
    </ListItem>
  )
}
