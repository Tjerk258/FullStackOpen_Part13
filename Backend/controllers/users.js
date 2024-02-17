const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { Blog, User, Token } = require('../models')
const { Op } = require('sequelize')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).send('Password to short')
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    passwordHash,
  })

  response.status(201).json(user)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll({
    attributes: {
      exclude: ['name', 'passwordHash']
    },
    include: Blog
  })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  let read = {
    [Op.in]: [true, false]
  }

  if (request.query.read) {
    read = request.query.read === 'true'
  }
  const users = await User.findByPk(request.params.id, {
    attributes: {
      exclude: ['name', 'passwordHash']
    },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'reading_list',
        attributes: { exclude: ['userid'] },
        through: {
          attributes: ['read'],
          where: {
            read: read
          }
        },
      }
    ],
  })
  response.json(users)
})

usersRouter.put('/:username', async (request, response, next) => {
  if (!request.user) {
    return response.status(401).send('For this you need to be logged in')
  } else if (!request.user.username === request.params.username) {
    return response.status(404).send('non existent ID')
  }
  try {
    const body = request.body
    request.user.username = body.username
    const newUser = await request.user.save()
    response.json(newUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter