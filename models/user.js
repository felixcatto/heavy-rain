import { encrypt } from '../lib/secure';


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,

    lastName: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },

    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: [1, Infinity],
      },
    },
  }, {});
  User.associate = function (models) {
    User.hasMany(models.Message);
    User.belongsTo(models.Role);
  };
  return User;
};
