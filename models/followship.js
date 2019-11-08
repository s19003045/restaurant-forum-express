'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    FollowingId: DataTypes.INTEGER,
    FollowerId: DataTypes.INTEGER
  }, {});
  Followship.associate = function (models) {
    // associations can be defined here
  };
  return Followship;
};