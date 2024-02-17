const logger = require('./utils/logger')
const config = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
require('express-async-errors')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const { Blog } = require('./models')
const { Sequelize } = require('sequelize')
const readingListRouter = require('./controllers/readingList')
const logoutRouter = require('./controllers/logout')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.authentication)
app.use(middleware.requestLogger)

app.get('/api/authors', async (req, res) => {
  const blogs = await Blog.findAll({
    group: ['author'],
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'articles'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
    ],
    order: [
      ['likes', 'DESC'],
    ],
  })
  res.json(blogs)
})

app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/readinglists', readingListRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  logger.info('connecting to', config.DATABASE_URL)
  await connectToDatabase()
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
  })
}

start()