const express = require('express')

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))

server.use(require('./controllers/authController'))

server.listen(3334, () => {
  console.log('Server running on port 3334')
})