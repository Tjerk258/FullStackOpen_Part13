const blogRouter = require('express').Router()
require('express-async-errors')
const { Op } = require('sequelize')
const { Blog, User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: User
  })
  console.log(req.blog)
  next()
}

blogRouter.get('/', async (request, response) => {
  const where = {}

  if (request.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${request.query.search}%` } },
      { author: { [Op.iLike]: `%${request.query.search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC'],
    ],
    where
  })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  if (!request.user) {
    return response.status(401).send('For this you need to be logged in')
  }
  const user = request.user
  try {
    const body = request.body
    const blog = await Blog.create({
      title: body.title,
      url: body.url,
      author: body.author,
      likes: body.likes | 0,
      userId: user.id
    })
    response.status(201).json(blog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', blogFinder, async (request, response) => {
  if (!request.user) {
    return response.status(401).send('For this you need to be logged in')
  }
  if (!request.user.id === request.blog.userId) {
    return response.status(401).send('You dont own this blog')
  }
  await request.blog.destroy()
  response.status(204).end()
})

blogRouter.put('/:id', blogFinder, async (request, response, next) => {
  if (request.body.title || request.body.author || request.body.url) {
    if (!request.user) {
      return response.status(401).send('For this you need to be logged in')
    } else if (!request.user.id === request.blog.userId) {
      return response.status(404).send('non existent ID')
    }
    return response.status(403).send('Not your blog')
  }
  try {
    const body = request.body
    request.blog.title = body.title || request.blog.title
    request.blog.url = body.url || request.blog.url
    request.blog.author = body.author || request.blog.author
    request.blog.likes = body.likes || request.blog.likes
    const newBlog = await request.blog.save()
    response.json(newBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter