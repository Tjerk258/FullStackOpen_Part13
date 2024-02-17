const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('reading_lists', 'read', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('reading_lists', 'read', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    })
  }
}