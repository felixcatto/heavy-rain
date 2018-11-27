
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  }, {});
  Article.associate = function (models) {
    Article.hasMany(models.Comment);
  };
  return Article;
};
