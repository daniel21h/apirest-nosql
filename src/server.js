const express = require('express')

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

require('./controllers/authController')(server)
require('./controllers/projectController')(server)

server.listen(3333, () => {
  console.log('Server running on port 3333')
})