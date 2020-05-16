/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-process-env */
const nextRuntimeDotenv = require('next-runtime-dotenv')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withPlugins = require('next-compose-plugins')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const withConfig = nextRuntimeDotenv({ public: ['API_URL', 'API_KEY'] })
const withTM = require('next-transpile-modules')(['three', 'drei'])

const nextConfig = {
  typescript: {
    ignoreDevErrors: false,
  },
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },

    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },

  webpack(config, options) {
    // only add plugin in development to client webpack config .

    // eslint-disable-next-line no-console
    if (options.dev && !options.isServer) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin())
    }

    return config
  },

  publicRuntimeConfig: {
    PROXY_MODE: process.env.PROXY_MODE,
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
    STATIC_PATH: process.env.STATIC_PATH,
    SHOPIFY_STOREFRONT_API_URL: process.env.SHOPIFY_STOREFRONT_API_URL,
    SHOPIFY_STOREFRONT_API_KEY: process.env.SHOPIFY_STOREFRONT_API_KEY,
  },
  serverRuntimeConfig: {},
}

module.exports = withConfig(
  withPlugins([withTM, withBundleAnalyzer], nextConfig),
)
