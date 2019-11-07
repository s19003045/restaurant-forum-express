'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    RestaurantId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {});
  Favorite.associate = function (models) {

  };
  return Favorite;
};