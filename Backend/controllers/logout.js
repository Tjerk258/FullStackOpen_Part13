const logoutRouter = require('express').Router()
const { Token } = require('../models')

logoutRouter.delete('/', async (request, response) => {
  const token = await Token.findOne({
    where: {
      token: request.body.token
    }
  })
  token.destroy()
  response.status(200).send('Succesvolly logged out')
})

module.exports = logoutRouter