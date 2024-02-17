const { Sequelize } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'createdAt')
    await queryInterface.removeColumn('blogs', 'updatedAt')
    await queryInterface.removeColumn('users', 'createdAt')
    await queryInterface.removeColumn('users', 'updatedAt')
    await queryInterface.addColumn('blogs', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE
    })
    await queryInterface.addColumn('blogs', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE
    })
    await queryInterface.addColumn('users', 'created_at', {
      allowNull: false,
      type: Sequelize.DATE
    })
    await queryInterface.addColumn('users', 'updated_at', {
      allowNull: false,
      type: Sequelize.DATE
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'created_at')
    await queryInterface.removeColumn('blogs', 'updated_at')
    await queryInterface.removeColumn('users', 'created_at')
    await queryInterface.removeColumn('users', 'updated_at')
  },
}