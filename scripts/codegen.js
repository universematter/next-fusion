/* eslint-disable no-process-env */
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
})

module.exports = {
  schema: [
    {
      [process.env.SHOPIFY_STOREFRONT_API_URL]: {
        headers: {
          'X-Shopify-Storefront-Access-Token':
            process.env.SHOPIFY_STOREFRONT_API_KEY,
        },
      },
    },
  ],
  documents: ['src/Services/API/Shopify/**/*.{ts,tsx}'],
  overwrite: true,

  generates: {
    'src/Services/API/Shopify/Shopify.d.tsx': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
}
