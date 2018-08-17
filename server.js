require('dotenv').config()
const proxy = require('express-http-proxy')
const express = require('express')
const app = express()
const PORT = 4000
const APIKEY = process.env.REACT_APP_RTTI_APIKEY

app.use('/api', proxy('api.translink.ca', {
  proxyReqPathResolver: function (req) {
    return `${req.url}?apikey=${APIKEY}`
  },

  proxyReqOptDecorator (proxyReqOpts) {
    proxyReqOpts.headers['Accept'] = 'application/json'
    return proxyReqOpts
  }
}))

app.use(express.static('build'))

app.listen(PORT, () => {
  console.log(`server listening at - http://localhost:${PORT}`)
})
