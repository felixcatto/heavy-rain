

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'ArticleId', {
    type: Sequelize.INTEGER,
    allowNull: true,
    onDelete: 'CASCADE',
    references: {
      model: 'Articles',
      key: 'id',
    },
  }),
  down: queryInterface => queryInterface.removeColumn('Comments', 'ArticleId'),
};
