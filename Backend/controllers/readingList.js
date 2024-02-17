const { ReadingList } = require('../models')

const readingListRouter = require('express').Router()

const readListFinder = async (req, res, next) => {
  req.readingList = await ReadingList.findByPk(req.params.id)
  next()
}

readingListRouter.post('/', async (request, response, next) => {
  try {
    const { userId, blogId } = request.body
    const readlist = await ReadingList.create({
      userId,
      blogId
    })
    response.status(201).json(readlist)
  } catch (error) {
    next(error)
  }
})

readingListRouter.put('/:id', readListFinder, async (request, response, next) => {
  if (!request.user) {
    return response.status(401).send('For this you need to be logged in')
  }
  if (!request.user.id === request.readingList.userId) {
    return response.status(401).send('You dont own this blog')
  }
  try {
    request.readingList.read = request.body.read
    await request.readingList.save()
    response.status(201).json(request.readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = readingListRouter