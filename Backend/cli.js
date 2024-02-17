const config = require('./utils/config')
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(config.DATABASE_URL)

const main = async () => {
  const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
  blogs.forEach(blog => console.log(blog.author,', \'', blog.title, '\', ', blog.likes, ' likes'))
}

main()