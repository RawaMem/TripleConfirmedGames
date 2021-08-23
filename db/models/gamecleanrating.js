'use strict';
module.exports = (sequelize, DataTypes) => {
  const GameCleanRating = sequelize.define('GameCleanRating', {
    userId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER
  }, {});
  GameCleanRating.associate = function(models) {
    // associations can be defined here
  };
  return GameCleanRating;
};