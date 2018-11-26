'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Comments', 'ArticleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Articles',
        key: 'id',
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'ArticleId');
  },
};
