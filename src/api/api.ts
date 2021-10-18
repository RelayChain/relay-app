import axios from 'axios'

export async function get(path: string, params = {}) {
  const response = await axios({
    method: 'get',
    url: `${path}`,
    params,
    headers: {
      'x-amberdata-blockchain-id': 'ethereum-mainnet',
      'x-api-key': 'UAKf14967e6caca4422f65bfde29ca63d65'
    },
    responseType: 'json'
  })
    .then(res => res.data)
    .catch(e => {
      return {
        hasError: true,
        ...e
      }
    })
  return response
}


export async function getTyped<T>(path: string, params = {}): Promise<T> {
  interface ServerResponse {
    data: T
  }
  const response = 
  await axios.request<T>({
    url: path,
    responseType: 'json',
    transformResponse: (r: ServerResponse) => {
      return r
    }
  }).then((response) => {
    const { data } = response
    return data
  })
    
    .catch(e => {
      return {
        hasError: true,
        ...e
      }
    })
  return response
}