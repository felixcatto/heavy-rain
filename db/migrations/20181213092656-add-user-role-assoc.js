

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'RoleId', {
    type: Sequelize.INTEGER,
    allowNull: true,
    onDelete: 'CASCADE',
    references: {
      model: 'Roles',
      key: 'id',
    },
  }),
  down: queryInterface => queryInterface.removeColumn('Users', 'RoleId'),
};
