const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'password_hash')
    await queryInterface.addColumn('users', 'password_hash', {
      allowNull: false,
      type: DataTypes.TEXT
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'password_hash')
    await queryInterface.addColumn('users', 'password_hash', {
      allowNull: false,
      type: DataTypes.TEXT
    })
  },

}