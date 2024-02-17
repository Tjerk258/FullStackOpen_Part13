const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.DATE,
      validator: {
        isDate: true,
        isAfter: '1990-12-31',
        isBeforeToday(value) {
          const today = new Date()
          if (value >= today) {
            throw new Error('Date must be before or equal to today.')
          }
        },
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}