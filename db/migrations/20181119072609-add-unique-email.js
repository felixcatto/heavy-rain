

module.exports = {
  up: queryInterface => queryInterface.addConstraint('Users', ['email'], {
    type: 'unique',
    name: 'custom_unique_constraint_name',
  }),

  down: queryInterface => queryInterface.removeConstraint('Users', 'custom_unique_constraint_name'),
};
