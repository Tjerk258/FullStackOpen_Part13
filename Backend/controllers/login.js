const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { Token, User } = require('../models')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (user.disabled) {
    response
      .status(401)
      .send('User accound dissabled please contact admin')
  }
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  Token.create({
    token,
    userId: user.id
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id })
})

module.exports = loginRouter