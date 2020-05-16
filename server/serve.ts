import express from 'express'
import path from 'path'

const server = express()
const port = parseInt(process.env.PORT || '3000', 10)
const staticPath = path.join(__dirname, '../out/')
server.use(express.static(staticPath))
server.listen(port)

console.log(
  `> Serving ${staticPath} at http://localhost:${port}`,
)
