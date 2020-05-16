// #region Global Imports
import 'isomorphic-unfetch'
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import getConfig from 'next/config'
// #endregion Global Imports

// #region Interface Imports
// import { HttpModel } from "@Interfaces"
// #endregion Interface Imports

const {
  publicRuntimeConfig: {
    SHOPIFY_STOREFRONT_API_URL,
    SHOPIFY_STOREFRONT_API_KEY,
  },
} = getConfig()

// const BaseUrl = `${API_URL}/api`

// import config from "../apollo.config"

export const shopify = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: SHOPIFY_STOREFRONT_API_URL,
    headers: {
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_API_KEY,
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})
