const Blog = require('./blogs')
const User = require('./user')
const ReadingList = require('./readingList')
const Token = require('./tokens')

User.hasMany(Blog, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
Blog.belongsTo(User, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })

User.hasMany(Token, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
Token.belongsTo(User, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })

User.belongsToMany(Blog, { through: ReadingList, as: 'reading_list' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_reading' })

module.exports = {
  Blog, User, ReadingList, Token
}