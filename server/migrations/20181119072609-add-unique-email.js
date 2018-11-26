'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', ['email'], {
      type: 'unique',
      name: 'custom_unique_constraint_name',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Users', 'custom_unique_constraint_name');
  }
};
