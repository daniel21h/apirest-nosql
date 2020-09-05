const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (request, response) => {
  try {
    const user = await User.create(request.body)

    return response.json({ user })
  } catch (err) {
    return response.status(400).send({ error: 'Registration failed.' })
  }
})

module.exports = router