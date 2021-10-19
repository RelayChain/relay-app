import { csConfig } from 'constants/CrosschainConfig'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../index'
import { setAllChainsData } from './actions'

export default function Updater(): null {
  const dispatch = useDispatch<AppDispatch>()

  // keep dark mode in sync with the system
  useEffect(() => {    
    csConfig()
      .then(data => {    
        dispatch(
          setAllChainsData({
            chainsBridge: data
          }))
      })
  }, [dispatch])

  return null
}
