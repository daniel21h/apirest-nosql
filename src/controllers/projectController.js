const express = require('express')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.use(authMiddleware)

router.get('/', async (request, response) => {
  return response.json({ message: 'Ok', user: request.userId })
})

module.exports = server => server.use('/projects', router)