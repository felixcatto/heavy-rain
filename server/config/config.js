module.exports = {
  development: {
    operatorsAliases: false,
    dialect: 'sqlite',
    storage: './mydb.sqlite',
  },
  test: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
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
