module.exports = {
  development: {
    operatorsAliases: false,
    dialect: 'sqlite',
    storage: './mydb.sqlite',
  },
  test: {
    host: '127.0.0.1',
    username: 'postgres',
    password: '1',
    database: 'database_production',
    operatorsAliases: false,
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    operatorsAliases: false,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
  },
};
