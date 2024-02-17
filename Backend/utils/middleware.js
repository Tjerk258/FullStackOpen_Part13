const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { User, Token } = require('../models')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error('error: ', error.name, ' - ', error)

  if (error.name === 'TypeError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.errors.map(mes => mes.message) })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const authentication = async (request, response, next) => {
  const token = getTokenFrom(request)
  request.token = token
  if (token !== null) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findByPk(decodedToken.id, {
      attributes: {
        exclude: ['passworrdHash']
      },
      include: [
        {
          model: Token
        }
      ]
    })
    console.log(JSON.stringify(user))
    if(user.tokens.map(token => token.token).includes(token) && !user.disabled) {
      request.user = user
    }
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authentication
}