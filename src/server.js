const express = require('express')

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

require('./server/controllers/authController')(server)
require('./server/controllers/projectController')(server)

server.listen(3333, () => {
  console.log('Server running on port 3333')
})