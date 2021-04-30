import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import React, { FC } from 'react'

const client = new ApolloClient({
  uri: 'https://zero-graph.0.exchange/subgraphs/name/zeroexchange/zerograph',
  cache: new InMemoryCache(),
})

const GraphQLProvider: FC = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)

export default GraphQLProvider
