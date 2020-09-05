const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const User = require('../models/User')
const authConfig = require('../../config/auth.json')

const router = express.Router()

// Gerar token
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    // Tempo de expiraçõa de um dia em segundos
    expiresIn: 86400,
  })
}

router.post('/register', async (request, response) => {
  const { email } = request.body

  try {
    if (await User.findOne({ email })) {
      return response.status(400).send({
        error: 'User already exists!'
      })
    }

    const user = await User.create(request.body)

    user.password = undefined

    return response.json({ 
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return response.status(400).send({ error: 'Registration failed.' })
  }
})

router.post('/authenticate', async (request, response) => {
  const { email, password } = request.body

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return response.status(400).send({
      error: 'User not found!'
    })
  }

  // Comparando senha criptografada
  if (!await bcrypt.compare(password, user.password)) {
    return response.status(400).send({
      error: 'Invalid password'
    })
  }

  user.password = undefined 

  return response.json({ 
    user, 
    token: generateToken({ id: user.id })
  })
})

router.post('/forgot-password', async (request, response) => {
  const { email } = request.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return response.status(400).send({
        error: 'User not found.'
      })
    }

    const token = crypto.randomBytes(20).toString('hex')

    // Data e tempo de expiração
    const now = new Date()
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordRestExpires: now,
      }
    })

    mailer.sendMail({
      to: email,
      from: 'danieldaniabreu@gmail.com',
      template: 'auth/forgot-password',
      context: { token },
    }, (err) => {
      if (err) {
        return response.status(400).send({
          error: 'Cannot send forgot password email.'
        })
      }

      return response.send()
    })
  } catch (err) {
    return response.status(400).send({
      error: 'Error on forgot password, try again!'
    })
  }
})

module.exports = server => server.use('/auth', router)