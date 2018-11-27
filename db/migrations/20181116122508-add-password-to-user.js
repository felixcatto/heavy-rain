

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'passwordDigest', {
    type: Sequelize.STRING,
  }),

  down: queryInterface => queryInterface.removeColumn('Users', 'passwordDigest'),
};
