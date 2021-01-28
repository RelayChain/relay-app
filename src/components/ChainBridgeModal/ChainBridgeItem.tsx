import { AutoColumn, ColumnCenter } from '../Column'
import { CheckCircle, ChevronsDown, XCircle } from 'react-feather'
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
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 0;
    margin-bottom: 0;
    font-weight: bold;
    font-size: 1.5rem;
    span {
      margin-right: 10px;
    }
  }
  .status {
    display: flex;
    font-size: 1rem;
    flex-direction: row;
    align-items: center;
    opacity: .5
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
`

export default function ChainBridgeItem ({ item, children, ...rest }: { item: any, children: any }) {

  const currency = {
    decimals: item.decimals,
    name: item.name,
    address: item.address,
    symbol: item.assetBase,
  };


  const message = {
    ['0']: 'Relayers Pending...',
    ['1']: 'Voting started...',
    ['2']: 'Wrapping up...',
    ['3']: 'Transfer Success!',
    ['4']: 'Transfer Cancelled.',
  }

  return (
    <ListItem>
      <CurrencyLogo size="50px" style={{ margin: '1rem 1rem 1.25rem 1rem' }} currency={currency} />
      <p>
        <span>{ item?.amount}</span>
        { item?.currentSymbol }
      </p>
      <ChevronsDown size="30" style={{ marginTop: '1rem', marginBottom: '1rem' }} />
      <p>
        <span>{ item?.amount}</span>
        { item?.targetSymbol }
      </p>
      <div className="status">
        { message[item?.status]}

        { parseInt(item?.status) < 3  ?
          <CustomLightSpinner src={Circle} alt="loader" size={'16px'} style={{ marginLeft: '6px'}} /> : ''
        }
        { item?.status === '3' &&
        <CheckCircle size={'16'} style={{ marginLeft: '6px', color: '#27AE60' }} />
        }
        { item?.status === '4' &&
        <XCircle size={'16'} style={{ marginLeft: '6px', color: '#ff007a' }} />
        }
      </div>
    </ListItem>
  )
}
