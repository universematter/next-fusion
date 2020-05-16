/* eslint-disable no-process-env */
// #region Global Imports
import express from 'express'
import next from 'next'
import path from 'path'
// #endregion Global Imports

// #region Local Imports
// import devProxy from './proxy'
// #endregion Local Imports

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  app.setAssetPrefix(process.env.STATIC_PATH)
  server.use(express.static(path.join(__dirname, '../public')))

  // if (process.env.PROXY_MODE === 'local') {
  //   // eslint-disable-next-line global-require
  //   const proxyMiddleware = require('http-proxy-middleware')
  //   Object.keys(devProxy).forEach((context) => {
  //     server.use(proxyMiddleware(context, devProxy[context]))
  //   })
  // }

  server.get('*', (req, res) => handler(req, res))

  server.listen(port)

  // eslint-disable-next-line no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  )
})
