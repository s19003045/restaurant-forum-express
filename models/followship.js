'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    FollowingId: DataTypes.STRING,
    FollowerId: DataTypes.STRING
  }, {});
  Followship.associate = function (models) {
    // associations can be defined here
  };
  return Followship;
};