const express = require('express')

const router = express.Router()

router.get('/', async (request, response) => {
  response.json({ message: 'Ok' })
})

module.exports = server => server.use('/projects', router)